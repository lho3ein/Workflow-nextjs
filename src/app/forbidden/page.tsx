import Link from "next/link";

export default function Forbidden() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 text-center">
         <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-slate-600 to-slate-800 text-lg text-white">
               <i className="fa-solid fa-diagram-project" />
            </div>
            <h1 className="text-xl font-bold text-white">سیستم گردش کار</h1>
         </div>

         <div className="mb-6 text-8xl font-black text-slate-700">403</div>

         <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <i className="fa-solid fa-lock text-3xl text-red-500" />
         </div>

         <h2 className="text-2xl font-bold text-white">دسترسی غیرمجاز</h2>
         <p className="mt-3 max-w-md text-sm text-slate-400">شما به این بخش دسترسی ندارید. برای دسترسی به این صفحه باید نقش مناسب داشته باشید.</p>

         <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-slate-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-600">
            <i className="fa-solid fa-arrow-right" />
            بازگشت به داشبورد
         </Link>
      </div>
   );
}
