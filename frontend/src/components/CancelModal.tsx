import { useNavigate } from "react-router-dom";

type ModalProps = {
  setIsCancelOpen: (isCancelOpen: boolean) => void;
};

const CancelModal = ({ setIsCancelOpen }: ModalProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-400 opacity-75 z-10"
        onClick={() => setIsCancelOpen(false)}
      ></div>
      <div className="fixed inset-0 flex justify-center items-center z-20">
        <div className="bg-white p-4 rounded shadow-lg">
          <h2 className="text-lg font-semibold mb-5">Cancel document?</h2>
          <div className="center flex justify-center items-center">
            <button
              className="mr-6 py-2.5 px-5 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-500 dark:text-gray-100 dark:border-gray-300 dark:hover:text-white dark:hover:bg-gray-400"
              onClick={() => setIsCancelOpen(false)}
            >
              NO
            </button>
            <button
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-[#5C840C] dark:hover:bg-[#67925B] dark:focus:ring-[#67925B]"
              onClick={() => {
                setIsCancelOpen(false);
                navigate("/document");
              }}
            >
              YES
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CancelModal;
