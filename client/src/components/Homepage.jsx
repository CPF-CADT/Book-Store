import { HomeHeader, Footer } from "./header_footer";
import React from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

const books = [
  {
    title: "Simple Way Of Piece Life.",
    author: "Armor Ramsey",
    price: 40,
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Great Travel At Desert",
    author: "Sanchit Howdy",
    price: 38,
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "YOUR SIMPLE BOOK COVER",
    author: "Arthur Doyle",
    price: 45,
    img: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "YOUR SIMPLE BOOK COVER",
    author: "Arthur Doyle",
    price: 45,
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
];

export function Homepage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HomeHeader />
      <main className="flex-1 flex flex-col">
        <div className="flex flex-1 max-w-7xl mx-auto w-full pt-12 pb-8 px-4">
          {/* Sidebar */}
          <aside className="w-64 hidden lg:block pr-8">
            <div className="bg-white rounded p-6">
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Price</h3>
                <div className="flex items-center mb-2">
                  <input type="num"
                    placeholder="$"
                    className="w-16 border border-gray-300 rounded px-2 py-1 mr-2"
                    onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  />
                  <span className="mx-1">to</span>
                  <input type="num"
                    placeholder="$"
                    className="w-16 border border-gray-300 rounded px-2 py-1 ml-2"
                    onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')} />
                </div>
                <button className="w-full bg-red-500 text-white py-2 rounded font-semibold mt-2">Filter</button>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center cursor-pointer py-2">
                  <span>Product type</span>
                  <span>+</span>
                </div>
                <div className="flex justify-between items-center cursor-pointer py-2">
                  <span>Availability</span>
                  <span>+</span>
                </div>
                <div className="flex justify-between items-center cursor-pointer py-2">
                  <span>Brand</span>
                  <span>+</span>
                </div>
                <div className="flex justify-between items-center cursor-pointer py-2">
                  <span>Color</span>
                  <span>+</span>
                </div>
                <div className="flex justify-between items-center cursor-pointer py-2">
                  <span>Material</span>
                  <span>+</span>
                </div>
              </div>
            </div>
          </aside>
          {/* Main Content */}
          <section className="flex-1">
            {/* Top Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center space-x-4 mb-2 md:mb-0">
                <span className="font-semibold text-sm text-gray-700">Sort by :</span>
                <select className="border-none bg-transparent font-semibold text-gray-500">
                  <option>Alphabetically, A-Z</option>
                  <option>Alphabetically, Z-A</option>
                  <option>Price, Low to High</option>
                  <option>Price, High to Low</option>
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Showing 1 - 12 of 26 result</span>
                <span className="font-semibold text-sm text-gray-700">Show :</span>
                <select className="border-none bg-transparent font-semibold text-gray-500">
                  <option>12</option>
                  <option>24</option>
                  <option>36</option>
                </select>
                <FaSearch className="text-xl text-gray-700 cursor-pointer" />
                <FaBars className="text-xl text-gray-700 cursor-pointer" />
              </div>
            </div>
            {/* Book Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {books.map((book, idx) => (
                <div key={idx} className="bg-white rounded-lg  p-6 flex flex-col items-center">
                  <div className="relative w-full h-56 flex items-center justify-center mb-4">
                    <img
                      src={book.img}
                      alt={book.title}
                      className="object-cover w-full h-full rounded"
                      
                    />
                    

                  </div>
                  <Link to={`/book/${book.id}`} className="block">
                  <div className="text-center cursor-pointer hover:bg-gray-50 transition ">
                    <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                    <p className="text-gray-500 mb-1">{book.author}</p>
                    <p className="text-red-500 font-normal text-xl">${book.price.toFixed(2)}</p>
                    <button className=" cursor-pointer bg-red-500 text-white px-6 py-2  font-semibold shadow  hover:bg-red-600 transition">
                      ADD TO CART
                    </button>


                  </div>
                </Link>
                </div>
              ))}

            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}