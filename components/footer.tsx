export default function Footer() {
  return (
    <footer className="py-6 flex flex-col items-center gap-2 text-xs text-gray-400">
      <p>Made by Tilak</p>
      <a
        href="https://onlychai.neocities.org/support?name=tilak&upi=9391041489%40superyes"
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 font-medium hover:bg-yellow-200 transition"
      >
        🍵 Buy me a chai
      </a>
    </footer>
  )
}
