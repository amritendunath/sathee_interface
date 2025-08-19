import { Listbox } from '@headlessui/react'
import { useState } from 'react'
import "../styles/App.css";
import { Brain, Zap } from 'lucide-react';

const options = [
    {
        value: 'quick',
        label: 'Quick response',
        // icon: <i className="fas fa-bolt text-gray-100 text-lg mr-5"/>,
        icon: <Zap size={22} color="#ffffff" className=' mr-4' />,
        info: <span className='font'>Fast, short answer</span>,
        badge: <span className="ml-[5px] bg-[#0B0E17] text-[#a3b0d9] text-xs font-sans rounded px-1 leading-4">2-3 sec</span>,
    },
    {
        value: 'think',
        label: 'Think Deeper',
        info: <span className='font'>Detailed, in-depth answer</span>,
        // icon: <img alt="Think" src="https://storage.googleapis.com/a1aa/image/e43a8391-4fad-45e0-1786-8c0415b141af.jpg" className="w-7 h-7 mr-2 rounded-full" />,
        // icon: <i class="fa-solid fa-brain mr-5"></i>,
        icon: <Brain size={22} color="#ffffff" className=' mr-4' />,
        badge: <span className=" ml-[5px] bg-[#0B0E17] text-[#a3b0d9] text-xs font-sans rounded px-1 leading-4 ">~10 sec</span>,
    },
];

export function CustomQuickResponseDropdown({ value, onChange }) {
    return (

        <Listbox
            value={value}
            onChange={onChange}
        >
            <div className="relative ">

                <Listbox.Button className="mt-1 flex items-center text-sm bg-transparent hover:bg-[#23283a] text-white px-3 py-[5px] rounded-[16px] border border-[#23283a] focus:outline-none focus:border-[#23283a] appearance-none pr-8">
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white text-xs">
                        <i className="fas fa-caret-down"></i>
                    </span>
                    {options.find(opt => opt.value === value)?.label}
                </Listbox.Button>
                <Listbox.Options
                    // bg-[#202531] using in options previously
                    className="min-w-[260px] absolute bottom-full mb-1 p-[5px] w-full bg-[rgba(32,37,49,1)] rounded-[10px] shadow-lg z-10 transition-all  outline-none ">
                    {options.map((option) => (
                        <Listbox.Option
                            key={option.value}
                            value={option.value}
                            className={({ active }) =>
                                `cursor-pointer select-none rounded-lg px-2 py-2 outline-none ${active ? 'bg-[#141820]' : ''
                                }`
                            }
                        >

                            {({ selected }) => (
                                <>
                                    <div className="flex items-center">
                                        {option.icon}
                                        <div>
                                            <p className="font-serif text-base leading-5 flex items-center text-gray-200">
                                                {option.label}
                                                {option.badge}
                                            </p>
                                            <p className="font-serif text-[#a3b0d9] text-xs leading-4 mt-[2px]">
                                                {option.info}
                                            </p>
                                        </div>
                                        <div className="ml-auto flex items-center">
                                            <span
                                                className={
                                                    `w-5 h-5 rounded-full border-2 border-[#a3b0d9]  flex items-center justify-center
                                                        ${selected ? 'bg-[#141820]' : 'border-[#5e6a82]/60'}`
                                                }>
                                                {selected && (
                                                    // <svg 
                                                    // className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                    //     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    // </svg>
                                                    <span className="w-3 h-3 rounded-full bg-gray-200 block"></span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}

                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </div>
        </Listbox>
    );
}



