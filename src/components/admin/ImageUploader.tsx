import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUploader = ({ images, onImagesChange, maxImages = 5 }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.filter(Boolean).length;
    if (remainingSlots <= 0) {
      toast({
        title: 'Limite de imagens',
        description: `Máximo de ${maxImages} imagens permitidas.`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    const uploadedUrls: string[] = [];

    for (const file of filesToUpload) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Arquivo inválido',
          description: 'Apenas imagens são permitidas.',
          variant: 'destructive',
        });
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'Tamanho máximo: 5MB por imagem.',
          variant: 'destructive',
        });
        continue;
      }

      const url = await uploadImage(file);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      const newImages = [...images.filter(Boolean), ...uploadedUrls];
      onImagesChange(newImages);
      toast({
        title: 'Upload concluído',
        description: `${uploadedUrls.length} imagem(ns) enviada(s).`,
      });
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];
    
    // Try to delete from storage if it's a Supabase URL
    if (imageUrl.includes('product-images')) {
      setUploadingIndex(index);
      try {
        const path = imageUrl.split('product-images/')[1];
        if (path) {
          await supabase.storage.from('product-images').remove([path]);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
      setUploadingIndex(null);
    }

    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages.length > 0 ? newImages : ['']);
  };

  const handleUrlChange = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
          "hover:border-primary hover:bg-primary/5",
          uploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Enviando imagens...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              Clique para fazer upload
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG ou WEBP (máx. 5MB cada)
            </p>
          </div>
        )}
      </div>

      {/* Image preview grid */}
      {images.filter(Boolean).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.filter(Boolean).map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <div className="w-full h-full rounded-lg overflow-hidden bg-muted border border-border">
                {image ? (
                  <img
                    src={image}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                disabled={uploadingIndex === index}
                className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                {uploadingIndex === index ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <X className="w-3 h-3" />
                )}
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* URL inputs for external images */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Ou adicione URLs de imagens externas:
        </p>
        {images.map((image, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={image}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-background"
            />
            {images.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        {images.filter(Boolean).length < maxImages && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onImagesChange([...images, ''])}
          >
            Adicionar URL
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
