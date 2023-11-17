'use client'

import { addDoc, collection, where, getDocs, query } from 'firebase/firestore';
import logo from './components/images/logo.png'
import Image from 'next/image';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { firestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from './store/useAuth';

export default function Home() {
  const [isLogin, setLogin] = useState(true);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col py-0 w-full bg-main font-RobotoMono">
      <div className='w-full m-0'>

        <Image 
          src={logo} 
          alt='Netflix home' 
          className='w-20 h-20 m-5'
        />

        <div className='relative items-center justify-center text-black'>
          <div className='flex flex-col bg-gray-400/50 p-3 rounded-md w-80 mx-auto my-auto'>
            <h1 className='text-center'>로그인</h1>
            <div>
              <input 
                type="text" 
                placeholder='이메일 주소' 
                value={id} 
                onChange={e => setId(e.target.value)}
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder='비밀번호' 
                value={pw} 
                onChange={e => setPw(e.target.value)} 
              />
            </div>

            {!isLogin && (
              <div>
                <input 
                  type="password" 
                  placeholder='비밀번호 확인' 
                  value={pwConfirm} 
                  onChange={e => setPwConfirm(e.target.value)} 
                />
              </div>
            )}
            
            <div className='flex justify-between'>
              <button
                onClick={async () => {
                  if (isLogin) {
                    const storedUser = await getDocs(
                      query(collection(firestore, "users"), where("name", "==", id))
                    );
                    const targetUsers = [];
                    storedUser.forEach((doc) => targetUsers.push(doc.data()));
                    if (targetUsers.length === 0) {
                      window.alert("해당 계정으로 가입된 정보가 없습니다");
                      return;
                    }
                    if (targetUsers.length > 1) {
                      console.error("데이터가 꼬인것 같아요");
                      return;
                    }
                    const targetUser = targetUsers[0];
                    if (targetUser.pw !== pw) {
                      window.alert("비밀번호가 다릅니다.");
                      return;
                    }
        
                    window.alert("로그인에 성공했습니다.");
                    signIn(targetUser);
                    // localStorage.setItem("user", JSON.stringify(targetUser));
                    router.push("/main");
                    return;
                  }
        
                  // 회원가입 모드
        
                  // validation
                  if (pw !== pwConfirm) {
                    window.alert("두개의 비밀번호가 다릅니다");
                    return;
                  }
        
                  const storedUser = await getDocs(
                    query(collection(firestore, "users"), where("name", "==", id))
                  );
                  const targetUsers = [];
                  storedUser.forEach((doc) => targetUsers.push(doc.data()));
                  if (targetUsers.length > 0) {
                    window.alert(
                      "중복된 계정 정보 이름이 있습니다. 이름을 변경해주세요."
                    );
                    return;
                  }
        
                  const newUser = {
                    id: uuidv4(),
                    name: id,
                    pw,
                  };
                  await addDoc(collection(firestore, "users"), newUser);
                  // localStorage.setItem("user", JSON.stringify(newUser));
                  signIn(useUser);
                  window.alert("회원가입에 완료했습니다");
                  router.push("/");

                  if (user) return router.push('/main');
                  router.push('/');
                }}
              >
                {isLogin ? '로그인' : '회원가입'}
              </button>
              <button onClick={() => setLogin(!isLogin)}>
                {isLogin ? '회원가입 하러가기' : '로그인 하러가기'}
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </main>
  )
}
