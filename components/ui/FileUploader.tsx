import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './Button';

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void;
  acceptedMimeTypes?: { [key: string]: string[] };
  maxSizeMb?: number;
  multiple?: boolean;
  unsupportedFormatError?: string;
  onError?: (message: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  acceptedMimeTypes,
  maxSizeMb = 200,
  multiple = false,
  unsupportedFormatError = 'Unsupported file format.',
  onError,
}) => {

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      if (!onError) return;
      const rejectionError = fileRejections[0].errors[0];
      if (rejectionError.code === 'file-too-large') {
        onError(`File is larger than ${maxSizeMb}MB.`);
      } else if (rejectionError.code === 'file-invalid-type') {
        onError(unsupportedFormatError);
      } else {
        onError(`File error: ${rejectionError.message}`);
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles);
    }
  }, [onFileUpload, maxSizeMb, unsupportedFormatError, onError]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: acceptedMimeTypes,
    maxSize: maxSizeMb * 1024 * 1024,
    noClick: true,
    noKeyboard: true,
    multiple,
  });

  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${isDragActive ? 'border-red-500 bg-slate-700/50' : 'border-slate-600 bg-slate-800'}`}>
      <input {...getInputProps()} />
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto md:mx-0 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-3-3m0 0l3-3m-3 3h12" />
            </svg>
            <p>Drag and drop {multiple ? 'files' : 'a file'} here</p>
            <p className="text-sm">Limit {maxSizeMb}MB per file</p>
        </div>
        <Button onClick={open} variant="secondary">
          Browse files
        </Button>
      </div>
    </div>
  );
};