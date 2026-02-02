import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GalleryImage, CategoryItem, GalleryCategory } from '@/types/gallery.types';

interface ImageEditorProps {
  image: GalleryImage;
  categories: CategoryItem[];
  onSave: (updates: Partial<GalleryImage>) => void;
  onClose: () => void;
}

export const ImageEditor = ({ image, categories, onSave, onClose }: ImageEditorProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(image.title);
  const [description, setDescription] = useState(image.description || '');
  const [altText, setAltText] = useState(image.alt_text);
  const [tags, setTags] = useState(image.tags?.join(', ') || '');
  const [photographer, setPhotographer] = useState(image.photographer || '');
  const [displayOrder, setDisplayOrder] = useState(image.display_order);
  const [isPublished, setIsPublished] = useState(image.is_published);
  const [categoryId, setCategoryId] = useState(image.category_id);

  const handleSave = () => {
    onSave({
      title,
      description: description || null,
      alt_text: altText,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      photographer: photographer || null,
      display_order: displayOrder,
      is_published: isPublished,
      category_id: categoryId
    });
  };

  // Filter out "tous" from selectable categories
  const selectableCategories = categories.filter(c => c.slug !== 'tous');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-display">{t('admin.editImage')}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Preview */}
          <div className="flex gap-4">
            <img
              src={image.thumbnail_url || image.url}
              alt={image.alt_text}
              className="w-32 h-32 object-cover rounded-lg shrink-0"
            />
            <div className="flex-1 space-y-2">
              <div className="space-y-1">
                <Label>{t('admin.imageTitle')} *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                <Label htmlFor="published">
                  {isPublished ? t('admin.published') : t('admin.draft')}
                </Label>
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('admin.uploadCategory')}</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectableCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {t(`gallery.categoryNames.${cat.slug}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('admin.imageOrder')}</Label>
              <Input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('admin.imageDescription')}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('admin.imageAltText')} *</Label>
            <Input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('admin.imageTags')}</Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="finale, 2024, soprano"
              />
            </div>

            <div className="space-y-2">
              <Label>{t('admin.imagePhotographer')}</Label>
              <Input
                value={photographer}
                onChange={(e) => setPhotographer(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            {t('admin.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!title || !altText}>
            {t('admin.saveChanges')}
          </Button>
        </div>
      </div>
    </div>
  );
};
