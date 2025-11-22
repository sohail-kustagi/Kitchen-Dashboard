import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import type { Dish } from '../App';

interface DishCardProps {
  dish: Dish;
  onToggleStatus: (id: string) => void;
}

export function DishCard({ dish, onToggleStatus }: DishCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Title and Status Badge */}
        <div className="space-y-2">
          <h3 className="text-gray-900">{dish.name}</h3>
          <Badge
            variant={dish.published ? 'default' : 'secondary'}
            className={
              dish.published
                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-200'
            }
          >
            {dish.published ? 'Published' : 'Unpublished'}
          </Badge>
        </div>

        {/* Toggle Status */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <Label htmlFor={`toggle-${dish.id}`} className="text-gray-700 cursor-pointer">
            Toggle Status
          </Label>
          <Switch
            id={`toggle-${dish.id}`}
            checked={dish.published}
            onCheckedChange={() => onToggleStatus(dish.id)}
          />
        </div>
      </div>
    </div>
  );
}
