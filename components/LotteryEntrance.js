import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { ethers } from "ethers"
import { useNotification } from "@web3uikit/core"

const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUIValues() {
        const entranceFeeFromContract = (await getEntranceFee()).toString()
        const numPlayersFromContract = (await getNumberOfPlayers()).toString()
        const recentWinnerFromContract = await getRecentWinner()
        setEntranceFee(entranceFeeFromContract)
        setNumberOfPlayers(numPlayersFromContract)
        setRecentWinner(recentWinnerFromContract)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        try {
            await tx.wait(1)
            updateUIValues()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "bottomL",
            icon: "bell",
        })
    }

    return (
        <div className="hero min-h-[800px]">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img
                    src="https://cdn.dribbble.com/users/427368/screenshots/10846214/slot-r.gif"
                    className="max-w-sm rounded-lg shadow-2xl"
                />
                <div>
                    <h1 className="text-5xl font-bold">Decentralized Lottery</h1>
                    {raffleAddress ? (
                        <div>
                            <p className="py-4">
                                Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                            </p>
                            <p className="py-4">
                                The current number of players is: {numberOfPlayers}
                            </p>
                            <p className="py-4">The most previous winner was: {recentWinner}</p>
                            <button
                                onClick={async function () {
                                    await enterRaffle({
                                        onSuccess: handleSuccess,
                                        onError: (error) => console.log(error),
                                    })
                                }}
                                className="btn  btn-primary"
                            >
                                Enter Raffle
                            </button>
                        </div>
                    ) : (
                        <p>Please connect to a supported chain</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LotteryEntrance
