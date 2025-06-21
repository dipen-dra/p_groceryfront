import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = () => {
        addToCart(product, 1);
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden group flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative overflow-hidden h-40">
                <img src={product.imageUrl || 'https://placehold.co/300x200/e2e8f0/4a5568?text=No+Image'} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-md font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{product.category?.name || 'Uncategorized'}</p>
                <div className="mt-auto flex justify-between items-center pt-2">
                    <p className="text-lg font-bold text-green-600">₹{product.price}</p>
                    <button onClick={handleAddToCart} className="bg-green-100 text-green-700 rounded-full p-1.5 hover:bg-green-600 hover:text-white transition-colors">
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;