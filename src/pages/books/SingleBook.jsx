import React from 'react';
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { getImgUrl } from '../../utils/getImgUrl';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';

const SingleBook = () => {
    const { id } = useParams();
    const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    if (isLoading) return <div className="text-center mt-10 text-lg">Loading...</div>;
    if (isError) return <div className="text-center mt-10 text-red-500">Error loading book info</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10">
            <div className="max-w-3xl w-full bg-white shadow-xl rounded-lg overflow-hidden md:flex">
                
                {/* Book Image */}
                <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-6">
                    <img
                        src={getImgUrl(book.coverImage)}
                        alt={book.title}
                        className="rounded-lg shadow-md w-full max-h-[400px] object-contain"
                    />
                </div>

                {/* Book Info */}
                <div className="md:w-1/2 p-8 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{book.title}</h1>
                        <p className="text-gray-700 mb-2">
                            <span className="font-semibold">Author:</span> {book.author || 'Admin'}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <span className="font-semibold">Published:</span> {new Date(book?.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700 mb-2 capitalize">
                            <span className="font-semibold">Category:</span> {book?.category}
                        </p>
                        <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                            <span className="font-semibold">Description:</span> {book.description}
                        </p>
                    </div>

                    <button
                        onClick={() => handleAddToCart(book)}
                        className="mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <FiShoppingCart className="text-lg" />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SingleBook;
