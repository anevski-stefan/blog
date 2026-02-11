"use client"

export function Newsletter() {
  return (
    <section className="py-20 px-6 md:px-16 border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="w-2 h-2 bg-home-accent rounded-full"></span>
          <p className="text-xs font-mono font-medium tracking-widest uppercase text-home-accent">
            Newsletter
          </p>
        </div>
        <h2 className="font-heading text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          Stay in the loop
        </h2>
        <p className="text-home-muted mb-8 max-w-md mx-auto">
          Get notified when I publish new articles. No spam, unsubscribe
          anytime.
        </p>
        <form
          onSubmit={e => {
            e.preventDefault()
            const successMsg = document.getElementById("newsletter-success")
            if (successMsg) {
              successMsg.classList.remove("hidden")
              setTimeout(() => successMsg.classList.add("hidden"), 3000)
            }
            ;(e.target as HTMLFormElement).reset()
          }}
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="your@email.com"
            required
            className="flex-1 bg-home-secondary/50 border border-white/10 rounded-full py-3 px-6 text-sm text-white placeholder:text-home-muted focus:outline-none focus:border-home-accent/50 transition-all duration-300"
          />
          <button
            type="submit"
            className="magnetic px-8 py-3 bg-home-accent text-white font-heading text-sm font-medium tracking-widest uppercase rounded-full hover:bg-home-accent/90 transition-all duration-300 whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
        <p
          id="newsletter-success"
          className="hidden text-home-accent text-sm mt-4"
        >
          ✓ Thanks for subscribing!
        </p>
      </div>
    </section>
  )
}
