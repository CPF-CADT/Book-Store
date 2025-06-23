// import { FaSearch, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

export function Product (){
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
}
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
    {
    title: "YOUR SIMPLE BOOK COVER",
    author: "Arthur Doyle",
    price: 45,
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
];