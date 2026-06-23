import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { FileText } from "lucide-react";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { prisma } from "@/lib/prisma";

export default async function BlogsPage() {
  // Ensure dynamic rendering for live updates
  await connection();

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col justify-between">
      <div>
        <Herader />
        
        <main>
          {/* Hero Section */}
          <section className="bg-white px-5 py-16 sm:px-6 lg:px-8 border-b border-slate-100">
            <div className="mx-auto max-w-7xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Blogs & Stories</p>
              <h1 className="mt-4 text-4xl font-black text-slate-900 tracking-tight sm:text-5xl lg:text-6xl">
                Measured Care, Local Change.
              </h1>
              <p className="mt-4 text-slate-600 max-w-2xl text-base sm:text-lg">
                Read our field stories, program updates, and technical guides about education, health, clean water, and relief initiatives.
              </p>
            </div>
          </section>

          <section className="px-5 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-16">
              
              {/* Featured Blog Section */}
              {featuredPost && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-6 rounded-full bg-emerald-600"></span>
                    <h2 className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Featured Story</h2>
                  </div>
                  
                  <Link 
                    href={`/blogs/${featuredPost.slug}`}
                    className="group grid gap-6 lg:grid-cols-12 items-center bg-white rounded-3xl border border-slate-100 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-350"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 lg:col-span-7">
                      <Image 
                        src={featuredPost.thumbnail} 
                        alt={featuredPost.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-103" 
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        priority
                      />
                    </div>
                    
                    <div className="space-y-4 lg:col-span-5 lg:pl-4">
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(featuredPost.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                        {featuredPost.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 group-hover:gap-2.5 transition-all">
                        Read Story <span className="text-base">→</span>
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Grid of Other Blogs */}
              {gridPosts.length > 0 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-6 rounded-full bg-emerald-600"></span>
                    <h2 className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Latest Articles</h2>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {gridPosts.map((post) => (
                      <Link 
                        href={`/blogs/${post.slug}`} 
                        key={post.id} 
                        className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                      >
                        <div>
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-50 mb-4">
                            <Image 
                              src={post.thumbnail} 
                              alt={post.title} 
                              fill 
                              className="object-cover transition-transform duration-500 group-hover:scale-103" 
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                          
                          <span className="text-[10px] font-bold text-slate-450 block mb-2">
                            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          
                          <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
                            {post.title}
                          </h3>
                          
                          <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="mt-4 border-t border-slate-50 pt-3 flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1">
                            Read Article <span>→</span>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {posts.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-16 text-center shadow-xs">
                  <FileText className="h-10 w-10 text-slate-350 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-700">No Articles Yet</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">We are writing exciting new field stories. Check back soon!</p>
                </div>
              )}
              
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
