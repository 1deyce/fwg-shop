import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import logo from "../../assets/img/logo1.jpg";
import "../../App.css";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-black absolute inset-x-0 top-0 z-50 px-10 max-h-[100px]">
            <nav 
                aria-label="Global" 
                className="flex items-center justify-between p-6 lg:px-8"
            >
                <div className="flex lg:flex-1">
                    <a href="/" className="text-xl text-white tracking-wider">
                        <span className="text-white sr-only">Shop FWG</span>Shop <span className="font-semibold">FWG</span> 
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="text-white h-6 w-6" />
                    </button>
                </div>  
                <div className="hidden lg:flex flex-1 justify-end gap-4">
                    <button>
                        <MagnifyingGlassIcon className="size-6 text-white" />
                    </button>
                    <a href="/" className="text-sm font-semibold leading-6 text-gray-900">
                        <ShoppingBagIcon className="size-6 text-white"/>
                    </a>
                </div>
            </nav>

            <Dialog 
                open={mobileMenuOpen} 
                onClose={setMobileMenuOpen} 
                className="lg:hidden"
            >
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                    <a href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                            <img
                            alt=""
                            src={logo}
                            className="h-8 w-auto"
                        />
                    </a>
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
                    </button>
                    </div>
                    <div className="mt-6 flow-root">
                    <div className="-my-6 divide-y divide-gray-500/10">
                        <div className="space-y-2 py-6">
                                <button
                                    type="button"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    <ShoppingBagIcon />
                                </button>
                        </div>
                        <div className="py-6 flex items-center flex-col gap-2">
                            <button className="text-white flex">
                                <MagnifyingGlassIcon className="size-6 pr-2" /> Search
                            </button>
                            <a href="/" className="flex font-semibold text-white">
                                <ShoppingBagIcon className="size-6 pr-2"/> Cart
                            </a>
                        </div>
                    </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}

export default Header;