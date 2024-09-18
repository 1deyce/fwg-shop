import "../App.css";
import { Link } from "react-router-dom";
import Header from "../components/UI/Header";
// import Footer from "../components/UI/Footer";

const Home = () => {
	return (
		<>
			<Header />
			<section className="w-[100vw] h-[100vh] bg-img">
				<div className="absolute inset-x-0 top-72 overflow-hidden sm:top-80 px-6 pt-14 lg:px-8">
				<h2 className="z-50 text-white text-[50px] font-bold">
					Let&apos;s Get Stronger!
				</h2>
				<Link to="/store">
					<button className="bg-white rounded-sm w-auto h-auto py-2 px-6 z-50 font-semibold text-lg shadow-black shadow-xl transform hover:scale-95 duration-500 hover:ring-1 hover:ring-gray-900">
						Shop Now
					</button>
				</Link>
				</div>
			</section>
			{/* <Footer /> */}
		</>
	);
};

export default Home;
