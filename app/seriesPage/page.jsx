"use client";

import Genres from "../components/genres";
import { useQuery } from "@tanstack/react-query";
import { fetchSeries } from "../util/http.js";
import { useAuth } from "../store/useAuth";
import Link from "next/link";
import Nav from "../components/nav";
import Series from "./../components/series";
import Header from "../components/header";

export default function SeriesPage() {
  const { user } = useAuth();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["series"],
    queryFn: fetchSeries,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  console.log(data);

  const series = data.series.results;
  const headerImage = series[Math.floor(Math.random() * series.length - 1)];

  if (!user) {
    return (
      <div>
        <Link href={"/"}>로그인</Link>을 해주세요
      </div>
    );
  }

  return (
    <>
      <div>
        <Nav />
        <div className="w-full flex justify-center">
          <Link key={headerImage.id} href={`detail/${headerImage.id}`}>
            <Header
              key={headerImage.id}
              id={headerImage.id}
              title={headerImage.title}
              headerImage={headerImage.backdrop_path}
            />
            <div className="text-black z-[100] absolute top-[65%] left-[25%] w-1/2 bg-gray-400/50 p-3 rounded-md mx-auto text-center">
              <p className="font-extrabold text-xl mb-2.5 border-b-solid border-b-white border-b-2 pb-0.5 w-80 mx-auto">
                {headerImage.name}
              </p>
              <p className="font-semibold line-clamp-3 m-10">
                {headerImage.overview
                  ? headerImage.overview
                  : "설명이 없습니다."}
              </p>
            </div>
          </Link>
        </div>
      </div>
      <div>
        <Series series={series} />
      </div>
      <div>
        <Genres movies={series} />
      </div>
    </>
  );
}
