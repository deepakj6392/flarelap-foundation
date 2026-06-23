import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { prisma } from "@/lib/prisma";
import { FileText, Calendar, User, ArrowLeft, Share2 } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate SEO Metadata dynamically from the database record
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const blog = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!blog) {
    return {
      title: "Blog Post Not Found | Flarelap Global Foundation",
      description: "The requested blog post could not be found.",
    };
  }

  const titleText = blog.metaTitle || `${blog.title} | Flarelap Global Foundation`;
  const descText = blog.metaDesc || blog.excerpt;
  const keywordList = blog.keywords || "NGO, India, education, water filter, health camp";

  return {
    title: titleText,
    description: descText,
    keywords: keywordList,
    openGraph: {
      title: titleText,
      description: descText,
      url: `https://flarelap.org/blogs/${blog.slug}`,
      images: [
        {
          url: blog.thumbnail,
          alt: blog.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
      images: [blog.thumbnail],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  // Enforce dynamic loading
  await connection();

  const { slug } = await params;
  
  // Load the current blog post
  const blog = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!blog || !blog.published) {
    notFound();
  }

  // Load other recent blog posts for the "Recommended Reading" sidebar
  const recommendations = await prisma.blogPost.findMany({
    where: {
      published: true,
      id: { not: blog.id },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col justify-between">
      <div>
        <Herader />

        <main className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumbs & Back Button */}
          <div className="mb-8 flex items-center justify-between">
            <Link 
              href="/blogs"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-emerald-700 transition"
            >
              <ArrowLeft className="h-4 w-4 text-emerald-700" />
              Back to Blogs
            </Link>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100/60 px-3 py-1 rounded-full uppercase tracking-wider dark:bg-emerald-950/40 dark:text-emerald-400">
              Community Story
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Main Blog Post Content Column */}
            <article className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 md:p-10 shadow-xs space-y-6">
              
              {/* Post Metadata */}
              <div className="space-y-4">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl md:text-5xl leading-tight">
                  {blog.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-450 dark:text-slate-500 border-b border-slate-100 pb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-emerald-700" />
                    {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="h-4 w-px bg-slate-200" />
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-emerald-700" />
                    Flarelap Global Foundation
                  </span>
                </div>
              </div>

              {/* Cover Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-50 shadow-md">
                <Image 
                  src={blog.thumbnail} 
                  alt={blog.title} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  priority
                />
              </div>

              {/* Blog Teaser/Excerpt */}
              <p className="text-base sm:text-lg text-slate-650 leading-relaxed font-semibold italic border-l-4 border-emerald-600 pl-4 py-1.5 bg-slate-50/50 rounded-r-lg">
                {blog.excerpt}
              </p>

              {/* Blog Content body rendering HTML */}
              <div 
                className="prose prose-slate max-w-none dark:prose-invert text-slate-800 dark:text-slate-350 text-sm sm:text-base leading-relaxed space-y-5
                  [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:pt-4 [&_h2]:pb-1
                  [&_p]:text-slate-700 [&_p]:leading-relaxed
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-slate-700
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:text-slate-700
                  [&_strong]:font-bold [&_strong]:text-slate-900"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Keywords/Tags indicator */}
              {blog.keywords && (
                <div className="border-t border-slate-100 pt-6 mt-8">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-450 dark:text-slate-550 mb-3">Keywords & Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {blog.keywords.split(",").map((kw) => (
                      <span 
                        key={kw} 
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200/50"
                      >
                        #{kw.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar Column */}
            <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
              
              {/* Recommendations Widget */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-700 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-600" />
                  Recommended Reading
                </h3>

                <div className="space-y-5">
                  {recommendations.map((rec) => (
                    <Link 
                      href={`/blogs/${rec.slug}`} 
                      key={rec.id}
                      className="group flex gap-4 items-start hover:opacity-90 transition"
                    >
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-50 border border-slate-100">
                        <Image 
                          src={rec.thumbnail} 
                          alt={rec.title} 
                          fill 
                          className="object-cover transition-transform duration-300 group-hover:scale-103"
                          sizes="96px"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 block">
                          {new Date(rec.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
                          {rec.title}
                        </h4>
                      </div>
                    </Link>
                  ))}

                  {recommendations.length === 0 && (
                    <p className="text-xs text-slate-450 italic">No other articles available.</p>
                  )}
                </div>
              </div>

              {/* Call to action Widget */}
              <div className="bg-gradient-to-tr from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden space-y-4">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-500/10 rounded-full translate-x-12 translate-y-12"></div>
                <h3 className="text-lg font-black tracking-tight leading-tight">Want to Make a Positive Difference?</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Support our mission to empower rural youth, promote healthcare, and sustain programs by volunteering or donating.
                </p>
                <div className="flex gap-3 pt-2">
                  <Link 
                    href="/donate" 
                    className="inline-flex items-center justify-center rounded-full bg-white text-emerald-900 text-xs font-bold px-4 py-2 hover:bg-emerald-50 transition shadow-sm"
                  >
                    Donate
                  </Link>
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center justify-center rounded-full border border-emerald-600 text-white text-xs font-bold px-4 py-2 hover:bg-white/10 transition"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>

            </aside>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
