// import React, { useContext } from 'react';
// import { CartContext } from '../context/CartContext.jsx';
// import { Plus } from 'lucide-react';
// import { toast } from 'react-toastify';

// const ProductCard = ({ product }) => {
//     const { addToCart } = useContext(CartContext);

//     const handleAddToCart = () => {
//         addToCart(product, 1);
//         toast.success(`${product.name} added to cart!`);
//     };

//     return (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden group flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//             <div className="relative overflow-hidden h-40">
//                 <img src={product.imageUrl || 'https://placehold.co/300x200/e2e8f0/4a5568?text=No+Image'} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
//             </div>
//             <div className="p-3 flex flex-col flex-grow">
//                 <h3 className="text-md font-semibold text-gray-800 truncate">{product.name}</h3>
//                 <p className="text-xs text-gray-500 mb-2">{product.category?.name || 'Uncategorized'}</p>
//                 <div className="mt-auto flex justify-between items-center pt-2">
//                     <p className="text-lg font-bold text-green-600">₹{product.price}</p>
//                     <button onClick={handleAddToCart} className="bg-green-100 text-green-700 rounded-full p-1.5 hover:bg-green-600 hover:text-white transition-colors">
//                         <Plus size={18} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductCard;


// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../auth/AuthContext';
// // Assuming you have a CartContext to handle adding items
// // import { CartContext } from '../context/CartContext';
// import { FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';

// const ProductCard = ({ product }) => {
//     const { user } = useContext(AuthContext);
//     // const { addToCart } = useContext(CartContext);
//     const navigate = useNavigate();

//     const [quantity, setQuantity] = useState(1);
//     const [isAdded, setIsAdded] = useState(false);

//     const handleIncrement = () => {
//         // Users can't add more than the available stock
//         if (quantity < product.stock) {
//             setQuantity(quantity + 1);
//         }
//     };

//     const handleDecrement = () => {
//         // Quantity cannot be less than 1
//         if (quantity > 1) {
//             setQuantity(quantity - 1);
//         }
//     };

//     const handleAddToCart = () => {
//         if (!user) {
//             navigate('/login');
//             return;
//         }

//         console.log(`Adding ${quantity} of ${product.name} to cart for ${user.fullName}`);
//         // In a real app, you would call your cart context here:
//         // addToCart(product, quantity);

//         // Provide visual feedback
//         setIsAdded(true);
//         setTimeout(() => {
//             setIsAdded(false);
//             navigate('/dashboard'); // Navigate after feedback
//         }, 1500); // Reset after 1.5 seconds
//     };

//     const isOutOfStock = product.stock === 0;

//     return (
//         <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full transition-shadow duration-300 hover:shadow-lg relative overflow-hidden">
//             {/* Stock Badge */}
//             <div 
//                 className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-1 rounded-full text-white ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}
//             >
//                 {isOutOfStock ? 'Out of Stock' : 'In Stock'}
//             </div>

//             <div className="w-full h-48">
//                  <img
//                     src={product.imageUrl || '/images/placeholder.png'}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                 />
//             </div>
           
//             <div className="p-4 flex flex-col flex-grow">
//                 <div className="flex-grow mb-4">
//                     <h3 className="text-lg font-bold text-gray-800 truncate">{product.name}</h3>
//                     <p className="text-sm text-gray-500">
//                         {product.stock > 0 ? `${product.stock} available` : 'Currently unavailable'}
//                     </p>
//                 </div>

//                 <div className="flex justify-between items-center">
//                     <p className="text-xl font-extrabold text-gray-900">${product.price.toFixed(2)}</p>
                    
//                     {/* Quantity Counter */}
//                     {!isOutOfStock && (
//                          <div className="flex items-center border border-gray-300 rounded-md">
//                             <button onClick={handleDecrement} className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled={quantity === 1}>
//                                 <FaMinus size={12} />
//                             </button>
//                             <span className="px-3 font-semibold text-gray-800">{quantity}</span>
//                             <button onClick={handleIncrement} className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled={quantity === product.stock}>
//                                 <FaPlus size={12} />
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 {/* Add to Cart Button */}
//                 <button
//                     onClick={handleAddToCart}
//                     disabled={isOutOfStock || isAdded}
//                     className={`mt-4 w-full flex justify-center items-center py-2.5 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
//                         isOutOfStock ? 'bg-gray-400 cursor-not-allowed' :
//                         isAdded ? 'bg-blue-500' : 'bg-green-600 hover:bg-green-700'
//                     }`}
//                 >
//                     {isAdded ? (
//                         'Added!'
//                     ) : isOutOfStock ? (
//                         'Out of Stock'
//                     ) : (
//                         <FaShoppingCart size={18} />
//                     )}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ProductCard;


import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { CartContext } from '../context/CartContext'; // ✅ Use CartContext
import { FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext); // ✅ Access addToCart
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    const handleIncrement = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }

        addToCart(product, quantity); // ✅ Actually add to cart

        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
            // Optionally navigate to cart or dashboard
            // navigate('/dashboard');
        }, 1500);
    };

    const isOutOfStock = product.stock === 0;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full transition-shadow duration-300 hover:shadow-lg relative overflow-hidden">
            <div 
                className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-1 rounded-full text-white ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}
            >
                {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </div>

            <div className="w-full h-48">
                <img
                    src={product.imageUrl || '/images/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>
           
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow mb-4">
                    <h3 className="text-lg font-bold text-gray-800 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                        {product.stock > 0 ? `${product.stock} available` : 'Currently unavailable'}
                    </p>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-xl font-extrabold text-gray-900">₹{product.price.toFixed(2)}</p>

                    {!isOutOfStock && (
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <button onClick={handleDecrement} className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled={quantity === 1}>
                                <FaMinus size={12} />
                            </button>
                            <span className="px-3 font-semibold text-gray-800">{quantity}</span>
                            <button onClick={handleIncrement} className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled={quantity === product.stock}>
                                <FaPlus size={12} />
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAdded}
                    className={`mt-4 w-full flex justify-center items-center py-2.5 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                        isOutOfStock ? 'bg-gray-400 cursor-not-allowed' :
                        isAdded ? 'bg-blue-500' : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {isAdded ? 'Added!' : isOutOfStock ? 'Out of Stock' : <FaShoppingCart size={18} />}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
