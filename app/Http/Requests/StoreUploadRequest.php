<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasRole(['Admin', 'Developer']) || $this->user()->can('upload-dokumen');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'year' => 'required|string|digits:4',
            'type' => 'required|in:masuk,keluar',
            'classification' => 'required|in:biasa,terbatas,rahasia',
            'file' => ['required', 'file', 'mimes:pdf,docx,doc,xlsx,xls,pptx,ppt', 'max:51200'], // 50MB
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.mimes' => 'Format berkas harus berupa dokumen resmi (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX).',
            'file.max' => 'Ukuran berkas tidak boleh melebihi 50MB.',
        ];
    }
}
