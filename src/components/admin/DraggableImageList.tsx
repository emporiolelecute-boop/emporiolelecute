import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DraggableImageListProps {
  images: string[];
  onReorder: (images: string[]) => void;
  onRemove: (index: number) => void;
}

interface SortableImageProps {
  id: string;
  url: string;
  index: number;
  isMain: boolean;
  onRemove: () => void;
}

const SortableImage = ({ id, url, index, isMain, onRemove }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group rounded-lg overflow-hidden border-2 transition-all",
        isDragging && "opacity-50 scale-105 z-50",
        isMain ? "border-primary ring-2 ring-primary/20" : "border-border"
      )}
    >
      {/* Main image badge */}
      {isMain && (
        <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          Principal
        </div>
      )}
      
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 right-10 z-10 p-1.5 bg-background/80 backdrop-blur-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-foreground" />
      </button>
      
      {/* Remove button */}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 z-10 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
      >
        <X className="w-4 h-4" />
      </Button>
      
      {/* Image */}
      <img
        src={url}
        alt={`Imagem ${index + 1}`}
        className="w-full aspect-square object-cover"
        loading="lazy"
      />
      
      {/* Index badge */}
      <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded-md">
        {index + 1}
      </div>
    </div>
  );
};

const DraggableImageList = ({ images, onReorder, onRemove }: DraggableImageListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.indexOf(active.id as string);
      const newIndex = images.indexOf(over.id as string);
      onReorder(arrayMove(images, oldIndex, newIndex));
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
        Nenhuma imagem adicionada
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={images} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <SortableImage
              key={url}
              id={url}
              url={url}
              index={index}
              isMain={index === 0}
              onRemove={() => onRemove(index)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableImageList;
