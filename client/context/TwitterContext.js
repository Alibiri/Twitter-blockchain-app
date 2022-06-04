import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { client } from '../lib/client'
export const TwitterContext = createContext()

export const TwitterProvider = ({ children }) => {
    const [appStatus, setAppStatus] = useState('')
    const [currentAccount, setCurrentAccount] = useState('')
    const [tweets, setTweets] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    const router = useRouter()
    useEffect(() => {
        checkIfWalletIsConnected()
      }, [])

      useEffect(() => {
        if (!currentAccount || appStatus !== 'connected') return
        getCurrentUserDetails(currentAccount)
        fetchTweets()
      }, [currentAccount, appStatus])
      

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return setAppStatus('noMetaMask')
          try{
           const addressArray = await window.ethereum.request ({
               method :'eth_accounts',
           })
           if (addressArray.length >0) {
            setAppStatus('connected')
            setCurrentAccount(addressArray[0])
            createUserAccount(addressArray[0])
           }else {
               router.push('/')
            setAppStatus('notConnected')
           }
          }catch(error) {
           setAppStatus('error')
          }
        
    }
    const connectToWallet = async () => {
        if(!window.ethereum) return setAppStatus('noMetaMask')
        try {
            setAppStatus('loading')
            const addressArray = await window.ethereum.request({
                method :'eth_requestAccounts',
            })

            if (addressArray.length >0) {
                setCurrentAccount(addressArray[0])
                createUserAccount(addressArray[0])
            }else {
                router.push('/')
                setAppStatus('notConnected')
            }
        }catch(error){
            setAppStatus('error')
        }
    }
     /**
   * Creates an account in Sanity DB if the user does not already have one
   * @param {String} userWalletAddress Wallet address of the currently logged in user
   */
     
       const createUserAccount = async (userWalletAddress = currentAccount) => {
            if (!window.ethereum) return setAppStatus('noMetaMask')
            try {
                const userDoc = {
                    _type: 'users',
                    _id: userWalletAddress,
                    name: 'Unnamed',
                    isProfileImageNft: false,
                    profileImage:
                      'https://www.01net.com/mrf4u/statics/i/ps/img.bfmtv.com/c/630/420/067c/75bb369a9d5282b4289f7ef34f27.jpg?width=1200&enable=upscale',
                    walletAddress: userWalletAddress,
                  }
                  await client.createIfNotExists(userDoc)
                  setAppStatus('connected')
            }catch(error){
               router.push('/')
               setAppStatus('error')
            }
        }
    
        const fetchTweets = async () => {
            const query = `
              *[_type == "tweets"]{
                "author": author->{name, walletAddress, profileImage, isProfileImageNft},
                tweet,
                timestamp
              }|order(timestamp desc)
            `
        
            // setTweets(await client.fetch(query))
        
            const sanityResponse = await client.fetch(query)
        
            setTweets([])
        
            /**
             * Async await not available with for..of loops.
             */
            sanityResponse.forEach(async (item) => {
              // profile image
                const newItem = {
                  tweet: item.tweet,
                  timestamp: item.timestamp,
                  author: {
                    name: item.author.name,
                    walletAddress: item.author.walletAddress,
                    profileImage: item.author.profileImage,
                    isProfileImageNft: item.author.isProfileImageNft,
                    
                  },
             }
        
                setTweets((prevState) => [...prevState, newItem])
            })

        }
        
          /**
           * Gets the current user details from Sanity DB.
           * @param {String} userAccount Wallet address of the currently logged in user
           * @returns null
           */
          const getCurrentUserDetails = async (userAccount = currentAccount) => {
            if (appStatus !== 'connected') return
        
            const query = `
              *[_type == "users" && _id == "${userAccount}"]{
                "tweets": tweets[]->{timestamp, tweet}|order(timestamp desc),
                name,
                profileImage,
                isProfileImageNft,
                coverImage,
                walletAddress
              }
            `
            const sanityResponse = await client.fetch(query)
        
            
        
            setCurrentUser({
              tweets: sanityResponse[0].tweets,
              name: sanityResponse[0].name,
              profileImage: sanityResponse[0].profileImage,
              isProfileImageNft: sanityResponse[0].isProfileImageNft,
              coverImage: sanityResponse[0].coverImage,
              walletAddress: sanityResponse[0].walletAddress,
            })
          
        }
    return (
        <TwitterContext.Provider value={{appStatus, currentAccount, connectToWallet, fetchTweets, tweets, currentUser, getCurrentUserDetails}}>
            {children}
        </TwitterContext.Provider>
    )
}