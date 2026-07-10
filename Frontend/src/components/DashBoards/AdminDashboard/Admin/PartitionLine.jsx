import { IoIosAddCircleOutline } from "react-icons/io";

const PartitionLine = ({ isEditable, onBtnClick = () => {} }) => {
  return (
    <>
      {isEditable && (
        <div className="flex items-center">
          <hr className="flex-grow" />
          <IoIosAddCircleOutline
            className=" ms-1 text-2xl box-content cursor-pointer hover:bg-black hover:text-white rounded-full"
            onClick={onBtnClick}
          />
        </div>
      )}
    </>
  );
};

export default PartitionLine;
