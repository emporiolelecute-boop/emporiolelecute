import { useState, useEffect } from "react";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyAddToCartProps {
  productName: string;
  price: string;
  onAction: () => void;
  isVisible: boolean;
}

export const StickyAddToCart = ({ productName, price, onAction, isVisible }: StickyAddToCartProps) => {
  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border p-4 transition-transform duration-500 md:hidden",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground uppercase font-bold truncate max-w-[120px]">
            {productName}
          </span>
          <span className="text-lg font-bold text-primary">
            {price}
          </span>
        </div>
        
        <Button 
          onClick={onAction}
          className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground rounded-full font-bold shadow-lg"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Encomendar
        </Button>
      </div>
    </div>
  );
};
