import { useRouter } from "next/router"
import { useState, useContext } from "react" 
import LoadingState from './LoadingState'
import FinishedState from './FinishedState'
import InitialState from './InitialState'
import { TwitterContext } from '../../context/TwitterContext'
import { client } from "../../lib/client"
import { contractABI , contractAddress } from "../../lib/constants"
import { ethers } from 'ethers'
import { pinJSONToIPFS, pinFileToIPFS } from '../../lib/pinata'

let window
let metamask

if (typeof window !== 'undefined' ) {
    metamask = window.ethereum
}

const getEthereumContract = async () => {
    if (!metamask) return 
    const provider = new ethers.providers.Web3Provider(metamask)
    const singer = provider.getSigner()
    const transactionContract = new ethers.Contract(contractAddress, contractABI, singer)
    return transactionContract
}

const ProfileImageMinter = () => {
    const { setAppStatus, currentAccount } = useContext(TwitterContext) 
    const router = useRouter()
    const [status, setStatus] = useState('initial')
    const [profileImage, setProfileImage] = useState('')
    const [name ,setName] = useState('')
    const [description, setDescription] = useState('')
    
    const mint = async () => {
        if (!name || !description || !profileImage) return
    setStatus('loading')

    const pinataMetaData = {
        name: `${name} - ${description}`,
      }

      const ipfsImageHash = await pinFileToIPFS(profileImage, pinataMetaData)

      await client.patch(currentAccount).set({profileImage, ipfsImageHash}).set({isProfileImageNft: true}).commit()
         

    const imageMetadata = {
        name : contractAddressname,
        description: description,
        image: `ipfs://${ipfsImageHash}`,
    }

    const ipfsJsonHash = await pinJSONToIPFS(imageMetadata, pinataMetaData)

    const contract = await getEthereumContract()
    const transactionParamaters = {
        to: contractAddress,
        from: currentAccount,
        data: await contract?.mint(currentAccount, `ipfs://${ipfsJsonHash}`),
    }
    
    try {
    await metamask.request({
        method: 'eth_sendTransaction',
        params: [transactionParamaters],
    })

    setStatus('finished')
    } catch (error) {
        console.log(error)
        setStatus('finished')
    }
    }
    const modalChildren = (modalStatus = status) => {
        switch (modalStatus) {
            case 'initial':
                return(
                    <InitialState
                      profileImage={profileImage}
                      setProfileImage={setProfileImage}
                      name={name}
                      setName={setName}
                      description={description}
                      setDescription={setDescription}
                      mint={mint}/>
                )
            case 'loading' :
                return <LoadingState/>  
            case 'finished' :
                    return <FinishedState/>
            default :
              router.push('/')
              setAppStatus('error')
            break;                
        }
    }
  return (
   <>{modalChildren(status)}</>
  )
}

export default ProfileImageMinter