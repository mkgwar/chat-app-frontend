const OpenImage = ({ setisOpenImage, selectedImage }) => {
  return (
    <div className="absolute bg-black bg-opacity-50 text-white top-0 left-0 bottom-0 right-0 flex justify-center items-center">
      <div className="bg-gray-900 h-4/5 w-3/5 shadow-md relative">
        <img
          src={selectedImage}
          alt=""
          className="absolute h-full w-full object-contain"
        />
        <div
          className="-top-2 -right-2 bg-blue-500 h-8 w-8 rounded-full shadow-md absolute flex justify-center items-center cursor-pointer"
          onClick={() => setisOpenImage(false)}
        >
          <span className="material-icons text-sm font-bold">close</span>
        </div>
      </div>
    </div>
  );
};

export default OpenImage;
