import { ConnectButton } from "@web3uikit/web3"

const Header = () => {
    return (
        <div className="navbar max-w-7xl mx-auto p-5 bg-base-100 shadow-xl rounded-lg">
            <div className="navbar-start">
                <a className="btn btn-ghost normal-case text-xl">Hardhat Raffle</a>
            </div>

            <div className="navbar-end">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}

export default Header
