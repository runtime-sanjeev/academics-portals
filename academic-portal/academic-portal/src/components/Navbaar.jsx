
function Navbaar() {
  return (
    <div>
        <nav className="bg-[#06B534] dark:bg-gray-900 fixed w-full  start-0 border-b border-gray-200 dark:border-gray-600">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">  
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className=" md:bg-[#06B534] flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li className="bg-[#06B534]">
              <a href="#" className="block py-2 px-3 md:text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Add New</a>
            </li>
            <li className="bg-[#06B534]">
              <a href="#" className="block py-2 px-3 md:text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Checklist</a>
            </li>
            <li className="bg-[#06B534]">
              <a href="#" className="block py-2 px-3 md:text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Duplicate Checklist</a>
            </li>
            <li className="bg-[#06B534]">
              <a href="#" className="block py-2 px-3 md:text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Submit To DEO</a>
            </li>
            <li className="bg-[#06B534]">
              <a href="#" className="block py-2 px-3 md:text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Sumitted Students</a>
            </li>
            <li className="bg-[#06B534]">
              <a href="#" className="block py-2 px-3 md:text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Payment</a>
            </li>
            <li className="bg-[#06B534]">
              <a href="#" className="block py-2 px-3 md:text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Consolidated Statement</a>
            </li>
          </ul>
        </div>
        </div>
  </nav>
    </div>
  )
}

export default Navbaar