import Link from 'next/link';

export default function Header() {
    return (
        <>
        <header className='bg-gray-800 text-white p-4'>
        <div>
            <nav>
                <ul className='flex justify-around'>
                    <li className='hover:bg-black py-2 px-3 rounded-full'>
                        <Link href="/">Home</Link>
                    </li>
                    <li className='hover:bg-black py-2 px-3 rounded-full'>
                        <Link href="/history">History</Link>
                    </li>
                </ul>
            </nav>
        </div>
        </header>
        </>
    );
}