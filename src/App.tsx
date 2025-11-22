import { useState, useEffect } from 'react';
import { DishCard } from './components/DishCard';
import { io } from 'socket.io-client';
import { API_URL } from './config';

export interface Dish {
  id: string;
  name: string;
  image: string;
  published: boolean;
}

interface BackendDish {
  dishId: string;
  dishName: string;
  imageUrl: string;
  isPublished: boolean;
}

const SOCKET_URL = API_URL;

export default function App() {
  const [dishes, setDishes] = useState<Dish[]>([]);

  const fetchDishes = async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/dishes`);
      const data: BackendDish[] = await response.json();
      const mappedDishes: Dish[] = data.map(d => ({
        id: d.dishId,
        name: d.dishName,
        image: d.imageUrl,
        published: d.isPublished
      }));
      setDishes(mappedDishes);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDishes();

    // Socket setup
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('dishesUpdated', () => {
      console.log('Dishes updated event received');
      fetchDishes();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      await fetch(`${SOCKET_URL}/api/dishes/${id}/toggle`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Error toggling dish status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Kitchen Dashboard</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map(dish => (
            <DishCard
              key={dish.id}
              dish={dish}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
