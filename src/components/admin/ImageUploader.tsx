import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useImageUpload } from '@/hooks/useImageUpload';
import { GalleryCategory, CategoryItem } from '@/types/gallery.types';

interface ImageUploaderProps {
  categories: CategoryItem[];
  onUploadComplete: () => void;
}

export const ImageUploader = ({ categories, onUploadComplete }: ImageUploaderProps) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<GalleryCategory>('performances');
  const [tags, setTags] = useState('');
  const [photographer, setPhotographer] = useState('');

  const { files, isUploading, addFiles, removeFile, clearFiles, uploadImages } = useImageUpload({
    onUploadComplete: () => {
      clearFiles();
      onUploadComplete();
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles);
  }, [addFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true
  });

  const handleUpload = async () => {
    await uploadImages(category, {
      photographer: photographer || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    });
  };

  // Filter out "tous" from categories for upload
  const uploadCategories = categories.filter(c => c.slug !== 'tous');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display text-foreground">{t('admin.uploadTitle')}</h2>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-foreground font-medium mb-1">
          {isDragActive ? t('admin.uploadDragDrop').split(',')[0] : t('admin.uploadDragDrop')}
        </p>
        <p className="text-sm text-muted-foreground">{t('admin.uploadFormats')}</p>
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={file.preview}
                  alt={file.file.name}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                
                {/* Status overlay */}
                <div className={`absolute inset-0 flex items-center justify-center rounded-lg ${
                  file.status === 'uploading' ? 'bg-black/50' :
                  file.status === 'success' ? 'bg-green-500/50' :
                  file.status === 'error' ? 'bg-red-500/50' : ''
                }`}>
                  {file.status === 'uploading' && (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  )}
                  {file.status === 'success' && (
                    <Check className="w-8 h-8 text-white" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-8 h-8 text-white" />
                  )}
                </div>

                {/* Progress bar */}
                {file.status === 'uploading' && (
                  <Progress value={file.progress} className="absolute bottom-0 left-0 right-0 h-1" />
                )}

                {/* Remove button */}
                {file.status === 'pending' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="absolute top-2 right-2 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}

                {/* File name */}
                <p className="mt-1 text-xs text-muted-foreground truncate">
                  {file.file.name}
                </p>
              </div>
            ))}
          </div>

          {/* Metadata form */}
          <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label>{t('admin.uploadCategory')} *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as GalleryCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {uploadCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {t(`gallery.categoryNames.${cat.slug}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('admin.uploadTags')}</Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="finale, 2024, soprano"
              />
            </div>

            <div className="space-y-2">
              <Label>{t('admin.uploadPhotographer')}</Label>
              <Input
                value={photographer}
                onChange={(e) => setPhotographer(e.target.value)}
                placeholder="Jean Martin"
              />
            </div>
          </div>

          {/* Upload button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={clearFiles} disabled={isUploading}>
              {t('admin.cancel')}
            </Button>
            <Button onClick={handleUpload} disabled={isUploading || files.length === 0}>
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('gallery.loading')}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {t('admin.uploadButton')} ({files.length})
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
