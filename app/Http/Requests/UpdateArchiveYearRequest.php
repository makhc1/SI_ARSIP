<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateArchiveYearRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasRole(['Admin', 'Developer']) || $this->user()->hasPermissionTo('manage-arsip');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'year' => 'sometimes|required|string|max:4',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'gdrive_folder_id' => 'sometimes|required|string',
        ];
    }
}
