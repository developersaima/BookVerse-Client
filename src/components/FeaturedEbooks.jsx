"use client";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function FeaturedEbooks({ books, loading }) {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto border-t border-base-content/5">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-extrabold text-base-content">Featured <span className="text-[#00a851]">Ebooks</span></h2>
        <div className="w-10 h-1 bg-[#00a851] mx-auto mt-3 rounded-full"></div>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <span className="loading loading-spinner loading-md text-[#00a851]"></span>
        </div>
      ) : books.length === 0 ? (
        <div className="p-10 border border-base-content/10 bg-base-200/40 rounded-2xl max-w-sm mx-auto text-center">
          <p className="text-base-content/50 text-sm font-medium">No published ebooks found.</p>
        </div>
      ) : (
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {books.map((book) => (
            <motion.div 
              key={book._id} 
              variants={fadeIn}
              whileHover={{ y: -6 }}
              className="group border border-base-content/10 bg-base-100 hover:border-[#00a851]/40 hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
            >
              <figure className="aspect-[4/5] bg-base-200 overflow-hidden relative">
                <img 
                  src={book.coverImage || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"} 
                  alt={book.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </figure>
              <div className="p-6">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#00a851] bg-[#00a851]/10 px-2.5 py-1 rounded-md">
                  {book.genre}
                </span>
                <h3 className="text-lg font-bold mt-4 text-base-content group-hover:text-[#00a851] transition-colors truncate">
                  {book.title}
                </h3>
                <p className="text-xs text-base-content/50 mt-1">By {book.writerName || "Anonymous"}</p>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-base-content/5">
                  <span className="text-xl font-black text-base-content">${book.price}</span>
                  <a href={`/ebooks/${book._id}`} className="px-4 py-2 text-xs font-bold tracking-wider uppercase text-white bg-[#00a851] hover:bg-[#008f44] rounded-xl transition-colors shadow-xs">
                    View Book
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}