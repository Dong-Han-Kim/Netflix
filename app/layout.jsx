import './globals.css';
import RQProvider from './components/RQProvider';
import { Nav } from './components/Nav';
import InitialContents from './hooks/useHydrate';
import { Suspense } from 'react';
import Loading from './components/Loading';

export const metadata = {
	title: 'DFLIX',
	description: '영화와 시리즈 소개 페이지',
	icons: {
		icon: '/favicon.ico',
	},
};

export default async function RootLayout({ children }) {
	return (
		<html>
			<body className="flex flex-col justify-between w-screen overflow-x-hidden">
				<RQProvider>
					<div className=" bg-black/40">
						<Suspense fallback={<Loading />}>
							<Nav />
						</Suspense>
					</div>
					<InitialContents>
						<main>{children}</main>
					</InitialContents>
				</RQProvider>
			</body>
		</html>
	);
}
