import { CircleStop, ArrowUp } from 'lucide-react';

const SendButton = ({ isStarting, input, startSSE, stopSSE }) => {

    const StartSSEButton = () => {
        return (
            <div className=" flex items-center gap-2 ml-auto ">
                <button
                    onClick={startSSE}
                    className={`w-8 h-8 flex items-center justify-center rounded-full focus:outline-none transition-colors border border-[#363c4d] ${input
                        ? 'bg-white text-black'
                        : 'bg-[#141820] text-white '
                        }`}
                >
                    <ArrowUp className="fas" size={22} />
                </button>
            </div>
        )
    }
    const StopSSEButton = () => {
        return (
            <div className=" flex items-center gap-2 ml-auto ">
                <button
                    className={`w-8 h-8 flex items-center justify-center rounded-full focus:outline-none transition-colors bg-white text-black`}
                    onClick={stopSSE}
                >
                    <CircleStop className="fas" size={32} />
                </button>
            </div>
        )
    }
    return (
        <div className="flex items-center gap-2 ml-auto">
            {isStarting ?
                <StopSSEButton />
                :
                <StartSSEButton />
            }
        </div>
    )
}

export default SendButton
