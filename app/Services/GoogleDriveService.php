<?php

namespace App\Services;

use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;
use Illuminate\Support\Facades\Cache;

class GoogleDriveService
{
    protected Client $client;

    protected Drive $drive;

    public function __construct()
    {
        $this->client = new Client;
        $this->client->setApplicationName('SIARSIP KUATHAN');
        $this->client->setScopes([Drive::DRIVE]);

        $credentialsPath = storage_path('app/credentials/credentials.json');

        if (file_exists($credentialsPath)) {
            $this->client->setAuthConfig($credentialsPath);
        }

        $this->drive = new Drive($this->client);
    }

    /**
     * Get files from a specific folder with caching.
     */
    public function getFilesInFolder(string $folderId)
    {
        $cacheKey = "drive_files_{$folderId}";

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($folderId) {
            $files = [];
            $pageToken = null;

            do {
                // only files, not folders
                $response = $this->drive->files->listFiles([
                    'q' => "'{$folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false",
                    'spaces' => 'drive',
                    'pageToken' => $pageToken,
                    'fields' => 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink)',
                ]);

                foreach ($response->files as $file) {
                    $files[] = $file;
                }
                $pageToken = $response->pageToken;
            } while ($pageToken != null);

            return $files;
        });
    }

    /**
     * Find a subfolder ID by its name inside a parent folder.
     */
    public function getFolderName(string $folderId): ?string
    {
        $cacheKey = "drive_folder_name_{$folderId}";

        return Cache::remember($cacheKey, now()->addMinutes(60), function () use ($folderId) {
            try {
                $folder = $this->drive->files->get($folderId, ['fields' => 'name']);

                return $folder->getName();
            } catch (\Exception $e) {
                return null;
            }
        });
    }

    public function getSubfolderIdByName(string $parentFolderId, string $folderName): ?string
    {
        $cacheKey = "drive_subfolder_{$parentFolderId}_".md5($folderName);

        return Cache::remember($cacheKey, now()->addMinutes(60), function () use ($parentFolderId, $folderName) {
            $response = $this->drive->files->listFiles([
                'q' => "'{$parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and name contains '{$folderName}' and trashed = false",
                'spaces' => 'drive',
                'fields' => 'files(id, name)',
                'pageSize' => 1,
            ]);

            if (count($response->files) > 0) {
                return $response->files[0]->getId();
            }

            return null;
        });
    }

    /**
     * Clear cache for a specific folder.
     */
    public function clearFolderCache(string $folderId): void
    {
        Cache::forget("drive_files_{$folderId}");
    }

    /**
     * Rename a file in Google Drive.
     */
    public function renameFile(string $fileId, string $newName)
    {
        $file = new DriveFile;
        $file->setName($newName);

        return $this->drive->files->update($fileId, $file);
    }

    /**
     * Get file metadata from Google Drive.
     */
    public function getFileMetadata(string $fileId)
    {
        return $this->drive->files->get($fileId, ['fields' => 'id, name, mimeType, parents']);
    }

    /**
     * Get file content stream from Google Drive.
     */
    public function getFileContent(string $fileId)
    {
        $response = $this->drive->files->get($fileId, ['alt' => 'media']);

        return $response->getBody()->getContents();
    }

    /**
     * Delete a file from Google Drive (moves to trash or deletes permanently depending on config).
     */
    public function deleteFile(string $fileId)
    {
        return $this->drive->files->delete($fileId);
    }

    /**
     * Upload a local file to a specific Google Drive folder.
     *
     * @return string Google Drive file ID
     */
    public function uploadFileToDrive(string $folderId, string $localFilePath, string $fileName, string $mimeType): string
    {
        $file = new DriveFile;
        $file->setName($fileName);
        $file->setParents([$folderId]);

        $result = $this->drive->files->create($file, [
            'data' => file_get_contents($localFilePath),
            'mimeType' => $mimeType,
            'uploadType' => 'multipart',
            'fields' => 'id',
        ]);

        return $result->id;
    }

    /**
     * Get or create a subfolder inside a parent folder by name.
     *
     * @return string folder ID
     */
    public function getOrCreateSubfolder(string $parentFolderId, string $folderName): string
    {
        $subfolderId = $this->getSubfolderIdByName($parentFolderId, $folderName);

        if ($subfolderId) {
            return $subfolderId;
        }

        $folder = new DriveFile;
        $folder->setName($folderName);
        $folder->setMimeType('application/vnd.google-apps.folder');
        $folder->setParents([$parentFolderId]);

        $result = $this->drive->files->create($folder, [
            'fields' => 'id',
        ]);

        return $result->id;
    }
}
