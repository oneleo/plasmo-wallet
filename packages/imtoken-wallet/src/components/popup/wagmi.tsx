import * as Wagmi from "wagmi"
import * as Chains from "wagmi/chains"
import * as PublicProvider from "wagmi/providers/public"

export const initWagmi = () => {
  const { chains, publicClient, webSocketPublicClient } = Wagmi.configureChains(
    [Chains.goerli],
    [PublicProvider.publicProvider()]
  )
  console.log(`publicClient: ${JSON.stringify(publicClient, null, 2)}`)
  // console.log(`usePublicClient: ${Wagmi.usePublicClient()}`)
  // console.log(`useQueryClient: ${Wagmi.useQueryClient()}`)

  // 錯誤: Uncaught (in promise) TypeError: (0 , _reactQuery.QueryClient) is not a constructor
  const config = Wagmi.createConfig({
    publicClient
  })

  return (
    <div>
      <Wagmi.WagmiConfig config={config}>
        <div></div>
      </Wagmi.WagmiConfig>
    </div>
  )
}
