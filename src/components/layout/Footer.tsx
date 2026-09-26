export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 mt-auto print:hidden">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} HireCraft. All rights reserved.
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Made with ❤️ by Arpit
        </div>
      </div>
    </footer>
  );
}
