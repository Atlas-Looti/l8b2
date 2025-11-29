/**
 * EVM Service - Blockchain operations using viem
 */

import type { EVMAPI } from "./types";

export class EVMService {
	private provider: any = null;
	private publicClient: any = null;
	private walletClient: any = null;
	private initialized: boolean = false;
	private defaultChain: any = null;

	constructor() {
		// Lazy initialization
	}

	/**
	 * Initialize EVM clients from Farcaster SDK
	 */
	private async initialize(): Promise<void> {
		if (this.initialized) {
			return;
		}

		this.initialized = true;

		// Only initialize in browser environment
		if (typeof window === "undefined") {
			this.provider = null;
			return;
		}

		try {
			// Dynamic imports to avoid bundling issues
			const { sdk } = await import("@farcaster/miniapp-sdk");
			const { createPublicClient, createWalletClient, custom, http } =
				await import("viem");
			const { base } = await import("viem/chains");

			this.provider = sdk.wallet.getEthereumProvider();

			if (this.provider) {
				// Default to Base chain (can be made configurable later)
				this.defaultChain = base;

				// Public client for reads
				this.publicClient = createPublicClient({
					chain: this.defaultChain,
					transport: http(),
				});

				// Wallet client for writes
				this.walletClient = createWalletClient({
					chain: this.defaultChain,
					transport: custom(this.provider),
				});
			}
		} catch (err) {
			// Not in Mini App environment or dependencies not available
			this.provider = null;
		}
	}

	/**
	 * Get current address from provider
	 */
	private async getCurrentAddress(): Promise<string | null> {
		if (!this.provider) return null;
		try {
			const accounts = await this.provider.request({ method: "eth_accounts" });
			return accounts[0] || null;
		} catch {
			return null;
		}
	}

	/**
	 * Format ether value (wei to ether)
	 */
	private formatEtherValue(value: string): string {
		try {
			const bigIntValue = BigInt(value);
			const divisor = BigInt(10 ** 18);
			const quotient = bigIntValue / divisor;
			const remainder = bigIntValue % divisor;
			if (remainder === BigInt(0)) {
				return quotient.toString();
			}
			// Simple decimal formatting
			return `${quotient}.${remainder.toString().padStart(18, "0").replace(/0+$/, "")}`;
		} catch {
			return "0";
		}
	}

	/**
	 * Parse ether value (ether to wei)
	 */
	private parseEtherValue(value: string): string {
		try {
			const parts = value.split(".");
			const whole = parts[0] || "0";
			const decimal = parts[1] || "";
			const paddedDecimal = decimal.padEnd(18, "0").slice(0, 18);
			const wei = BigInt(whole) * BigInt(10 ** 18) + BigInt(paddedDecimal);
			return wei.toString();
		} catch {
			return "0";
		}
	}

	/**
	 * Get interface for LootiScript exposure
	 */
	getInterface(): EVMAPI {
		const service = this;

		// Ensure initialization
		if (!this.initialized) {
			// Initialize asynchronously but don't block
			this.initialize().catch(() => {
				// Silent fail if not in Mini App
			});
		}

		return {
			read: async (
				contractAddress: string,
				abi: any,
				functionName: string,
				args?: any[],
			) => {
				await service.initialize();
				if (!service.publicClient) {
					throw new Error("EVM read not available");
				}

				try {
					return await service.publicClient.readContract({
						address: contractAddress as `0x${string}`,
						abi,
						functionName,
						args: args || [],
					});
				} catch (err: any) {
					throw new Error(err?.message || "Read contract failed");
				}
			},

			write: async (
				contractAddress: string,
				abi: any,
				functionName: string,
				args?: any[],
			) => {
				await service.initialize();
				if (!service.walletClient) {
					throw new Error("EVM write not available");
				}

				try {
					const [account] = await service.walletClient.getAddresses();
					if (!account) {
						throw new Error("No account connected");
					}

					const hash = await service.walletClient.writeContract({
						address: contractAddress as `0x${string}`,
						abi,
						functionName,
						args: args || [],
						account,
					});

					return hash;
				} catch (err: any) {
					throw new Error(err?.message || "Write contract failed");
				}
			},

			call: async (
				contractAddress: string,
				abi: any,
				functionName: string,
				args?: any[],
			) => {
				await service.initialize();
				if (!service.publicClient) {
					throw new Error("EVM call not available");
				}

				try {
					// Simulate contract call
					const result = await service.publicClient.simulateContract({
						address: contractAddress as `0x${string}`,
						abi,
						functionName,
						args: args || [],
					});

					return result;
				} catch (err: any) {
					throw new Error(err?.message || "Call contract failed");
				}
			},

			getBalance: async (address?: string) => {
				await service.initialize();
				if (!service.publicClient) {
					return "0";
				}

				try {
					const addr = address || (await service.getCurrentAddress());
					if (!addr) {
						return "0";
					}

					const balance = await service.publicClient.getBalance({
						address: addr as `0x${string}`,
					});

					return balance.toString();
				} catch {
					return "0";
				}
			},

			formatEther: (value: string) => {
				return service.formatEtherValue(value);
			},

			parseEther: (value: string) => {
				return service.parseEtherValue(value);
			},
		};
	}

	/**
	 * Cleanup resources
	 */
	dispose(): void {
		this.provider = null;
		this.publicClient = null;
		this.walletClient = null;
		this.initialized = false;
	}
}
