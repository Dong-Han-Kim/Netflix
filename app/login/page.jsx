'use client';

import { useState } from 'react';
import { auth, firestore } from '../../firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '../store/useAuth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, where, getDocs, query } from 'firebase/firestore';
import Link from 'next/link';

export default function Login() {
	const [isLogin, setLogin] = useState(true);
	const [id, setId] = useState('');
	const [pw, setPw] = useState('');
	const { signIn } = useAuth();
	const router = useRouter();

	const handleGoogleLoginButtonClick = async () => {
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);
		const { user } = result;
		const newUser = {
			id: user.uid,
			email: user.email.split('@')[0],
		};
		signIn(newUser);
		localStorage.setItem('user', JSON.stringify(newUser));
		router.push('/main');
	};

	return (
		<main className="flex items-center justify-center flex-col w-screeen h-screen font-RobotoMono">
			<div className="flex flex-col bg-black bg-opacity-75 p-9 rounded-md w-96 mx-auto flex-col">
				<h1 className="text-center m-5 text-white">DFLIX</h1>
				<form className=" relative items-center justify-center text-black">
					<div className="text-center mb-3">
						<input
							type="text"
							placeholder="ID"
							value={id}
							onChange={(e) => setId(e.target.value)}
							className="rounded-md p-2 w-full"
						/>
					</div>
					<div className="text-center mb-3">
						<input
							type="password"
							placeholder="Password"
							value={pw}
							onChange={(e) => setPw(e.target.value)}
							className="rounded-md p-2 w-full"
						/>
					</div>

					<button
						className="w-full bg-red-600 hover:bg-opacity-25 text-white p-2"
						onClick={async (e) => {
							e.preventDefault();
							if (id === '' || pw === '') {
								alert('아이디 또는 비밀번호를 입력해주세요');
								return;
							}
							if (isLogin) {
								const storedUser = await getDocs(
									query(collection(firestore, 'users'), where('name', '==', id))
								);
								const targetUsers = [];
								storedUser.forEach((doc) => targetUsers.push(doc.data()));

								if (targetUsers.length === 0) {
									window.alert('해당 계정으로 가입된 정보가 없습니다');
									return;
								}
								if (targetUsers.length > 1) {
									console.error('데이터가 꼬인것 같아요');
									return;
								}
								const targetUser = targetUsers[0];
								if (targetUser.pw !== pw) {
									window.alert('비밀번호가 다릅니다.');
									return;
								}

								window.alert('로그인에 성공했습니다.');
								signIn(targetUser);
								// localStorage.setItem("user", JSON.stringify(targetUser));
								router.push('/main');
								return;
							}

							console.log(targetUser);
						}}>
						로그인
					</button>
				</form>

				<div className="text-center">
					<span className="text-gray-500">회원이 아니신가요? </span>
					<Link href="/signup" className="hover:underline">
						지금 가입하세요
					</Link>
				</div>

				<button
					onClick={handleGoogleLoginButtonClick}
					className="bg-red-600 hover:bg-opacity-25 text-white p-2">
					구글 로그인
				</button>
			</div>
		</main>
	);
}
