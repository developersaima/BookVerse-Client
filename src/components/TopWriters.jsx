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

export default function TopWriters({ writers, loading }) {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto border-t border-base-content/5 mb-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-extrabold text-base-content">Top <span className="text-[#00a851]">Writers</span></h2>
        <div className="w-10 h-1 bg-[#00a851] mx-auto mt-3 rounded-full"></div>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <span className="loading loading-spinner loading-md text-[#00a851]"></span>
        </div>
      ) : writers.length === 0 ? (
        <div className="p-10 border border-base-content/10 bg-base-200/40 rounded-2xl max-w-sm mx-auto text-center">
          <p className="text-slate-400 text-sm font-medium">No active writers found.</p>
        </div>
      ) : (
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {writers.map((writer) => (
            <motion.div 
              key={writer._id} 
              variants={fadeIn}
              whileHover={{ y: -4 }}
              className="group p-8 border border-base-content/10 bg-base-100 hover:border-[#00a851]/30 hover:shadow-xl rounded-2xl flex flex-col items-center transition-all duration-300"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border border-base-content/10 group-hover:border-[#00a851] p-1 transition-colors duration-300 mb-4">
                <img 
                  src={writer.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"} 
                  alt={writer.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="font-bold text-base-content/80 text-base tracking-wide group-hover:text-base-content transition-colors">
                {writer.name}
              </h3>
              <p className="text-xs text-base-content/40 mt-1 font-mono">{writer.email}</p>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#00a851] bg-[#00a851]/10 px-3 py-1 rounded-full mt-4">
                Top Author
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}