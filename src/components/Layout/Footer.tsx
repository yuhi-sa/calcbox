export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} CalcBox - 暮らしに役立つ無料計算ツール集</p>
      </div>
    </footer>
  );
}
