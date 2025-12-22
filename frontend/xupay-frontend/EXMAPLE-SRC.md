some design style we can use dashbaord or main 
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, ArrowUp, ArrowDown, Search, Bell, Settings, Wallet, Users, CreditCardIcon, LogOut } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-[#13151a] border-b border-[#2d3748]/30 h-14 flex items-center px-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 flex items-center space-x-2">
          <div className="w-4 h-4 rounded-sm bg-[#00c853]"></div>
          <span className="text-sm">vaulta.com</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-[#1d2129] rounded-lg pl-10 pr-4 py-1.5 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-[#00c853]"
            />
          </div>
          <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-[#00c853] flex items-center justify-center text-sm font-medium">
            A
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar Navigation */}
        <aside className="w-16 bg-[#0f1115] border-r border-[#2d3748]/30 flex flex-col items-center py-4">
          <div className="w-8 h-8 mb-6">
            <div className="w-full h-full rounded-sm bg-[#00c853]"></div>
          </div>
          
          <nav className="flex flex-col space-y-6 mt-8">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1d2129]">
              <Wallet className="w-4 h-4 text-[#00c853]" />
            </div>
            
            <div className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1d2129]">
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            
            <div className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1d2129]">
              <CreditCardIcon className="w-4 h-4 text-gray-400" />
            </div>
            
            <div className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1d2129]">
              <Settings className="w-4 h-4 text-gray-400" />
            </div>
          </nav>
          
          <div className="mt-auto mb-6">
            <LogOut className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Good Afternoon Aldeen!</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Referral Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#13151a] rounded-xl p-6 border border-[#2d3748]/30"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#1d2129] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-sm bg-[#00c853]"></div>
                    </div>
                  </div>
                  <p className="text-center text-gray-400 text-sm mb-4">
                    Invite friends with code below and redeem special bonus $15 from us!
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="bg-[#1d2129] px-3 py-1 rounded-lg text-sm">
                      Aldeen1426
                    </div>
                    <button className="ml-2 text-[#00c853] hover:text-[#00b040]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </motion.div>
                
                {/* Balance Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#13151a] rounded-xl p-6 border border-[#2d3748]/30"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-[#1d2129] flex items-center justify-center mr-2">
                        <CreditCard className="w-4 h-4 text-[#00c853]" />
                      </div>
                      <div>
                        <h3 className="font-medium">Main Wallet</h3>
                        <p className="text-sm text-gray-400">0x124412</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-400 mr-2">Manage</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-gray-400 text-sm mb-1">Total Balance</p>
                    <h2 className="text-3xl font-bold mb-1">$32,126.00</h2>
                    <div className="flex items-center text-sm">
                      <ArrowUp className="w-4 h-4 text-[#00c853] mr-1" />
                      <span className="text-[#00c853]">15%</span>
                      <span className="text-gray-400 ml-1">from previous</span>
                      <div className="ml-4 flex items-center">
                        <img src="https://placehold.co/20x12" alt="USD" className="w-5 h-3 mr-1" />
                        <span className="text-gray-400">USD</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Activity Summary */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#13151a] rounded-xl p-6 border border-[#2d3748]/30 mb-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Activity Summary</h3>
                  <div className="flex">
                    <button className="px-3 py-1 text-sm rounded-lg bg-[#1d2129] mr-2">Monthly</button>
                    <button className="px-3 py-1 text-sm rounded-lg bg-[#00c853]/20 text-[#00c853]">Weekly</button>
                  </div>
                </div>
                
                <div className="h-64 relative">
                  {/* Chart background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] to-[#1d2129]/30 rounded-lg"></div>
                  
                  {/* Chart content */}
                  <div className="absolute inset-0 flex items-end justify-between px-6 py-4">
                    <div className="text-xs text-gray-500">$800</div>
                    <div className="text-xs text-gray-500">$400</div>
                    <div className="text-xs text-gray-500">$100</div>
                  </div>
                  
                  {/* Chart lines */}
                  <div className="absolute inset-0 px-6 py-4 flex items-end justify-between">
                    <div className="w-full h-full relative">
                      {/* Income line */}
                      <svg className="w-full h-full" viewBox="0 0 100 30">
                        <path 
                          d="M0,20 C10,15 20,18 30,12 C40,8 50,10 60,5 C70,8 80,12 90,10 C95,9 100,8" 
                          fill="none" 
                          stroke="#00c853" 
                          strokeWidth="1.5"
                          className="opacity-50"
                        />
                        <path 
                          d="M0,20 C10,15 20,18 30,12 C40,8 50,10 60,5 C70,8 80,12 90,10 C95,9 100,8" 
                          fill="url(#income-gradient)" 
                          stroke="none" 
                        />
                      </svg>
                      
                      {/* Expense line */}
                      <svg className="w-full h-full absolute top-0" viewBox="0 0 100 30">
                        <path 
                          d="M0,15 C10,18 20,12 30,15 C40,20 50,18 60,22 C70,20 80,18 90,20 C95,21 100,22" 
                          fill="none" 
                          stroke="#3b82f6" 
                          strokeWidth="1.5"
                          className="opacity-50"
                        />
                        <path 
                          d="M0,15 C10,18 20,12 30,15 C40,20 50,18 60,22 C70,20 80,18 90,20 C95,21 100,22" 
                          fill="url(#expense-gradient)" 
                          stroke="none" 
                        />
                      </svg>
                      
                      {/* Gradient definitions */}
                      <defs>
                        <linearGradient id="income-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#00c853" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#00c853" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="expense-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </div>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6 text-xs text-gray-500">
                    <span>Jan 05</span>
                    <span>Jan 12</span>
                    <span>Jan 19</span>
                    <span>Jan 26</span>
                    <span>Feb 02</span>
                    <span>Feb 09</span>
                    <span>Feb 16</span>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute top-1/2 left-[45%] transform -translate-x-1/2 -translate-y-1/2 bg-[#0f1115] border border-[#2d3748]/50 rounded-lg p-3 shadow-xl w-36">
                    <div className="text-xs text-gray-400 mb-1">January 27 2025</div>
                    <div className="flex items-center text-xs mb-1">
                      <div className="w-2 h-2 rounded-full bg-[#3b82f6] mr-2"></div>
                      <span className="text-gray-400">Income</span>
                      <span className="ml-auto text-white">$783</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#00c853] mr-2"></div>
                      <span className="text-gray-400">Expense</span>
                      <span className="ml-auto text-white">$421</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Recent Withdraws */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#13151a] rounded-xl p-6 border border-[#2d3748]/30"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Recent Withdraws</h3>
                  <button className="text-sm text-[#00c853] hover:text-[#00b040]">View All</button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1d2129]">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#1d2129] flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00c853]">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">To : Rayhan Noor</p>
                        <p className="text-xs text-gray-400">Bank Transfer</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">-$120.00</p>
                      <div className="flex items-center justify-end">
                        <span className="text-xs text-green-500">Success</span>
                        <span className="text-xs text-gray-400 ml-2">• 12 February 2025</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1d2129]">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#1d2129] flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">To : Nada Salsabila</p>
                        <p className="text-xs text-gray-400">Bank Transfer</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">-$120.00</p>
                      <div className="flex items-center justify-end">
                        <span className="text-xs text-red-500">Failed</span>
                        <span className="text-xs text-gray-400 ml-2">• 10 February 2025</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1d2129]">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#1d2129] flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00c853]">
                          <path d="M17 8v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2z"></path>
                          <path d="M14 12.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">To : Isa Hanafi</p>
                        <p className="text-xs text-gray-400">Paypal</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">-$252.00</p>
                      <div className="flex items-center justify-end">
                        <span className="text-xs text-green-500">Success</span>
                        <span className="text-xs text-gray-400 ml-2">• 9 February 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Credit Card Display */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#13151a] rounded-xl p-6 border border-[#2d3748]/30"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <span className="bg-green-500 w-3 h-3 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">Credit</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Debit</span>
                    <span className="w-12 h-6 rounded-full bg-[#1d2129] flex items-center p-1">
                      <span className="w-4 h-4 rounded-full bg-[#00c853]"></span>
                    </span>
                  </div>
                </div>
                
                <div className="bg-[#1d2129] rounded-xl p-6 mb-4">
                  <div className="flex justify-between mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#0f1115] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00c853]">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-4-4H11a4 4 0 0 0-4 4v2"></path>
                        <circle cx="15" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end">
                        <span className="text-xs text-gray-400 mr-1">**** ****</span>
                        <span className="font-medium">6541</span>
                      </div>
                      <div className="text-xs text-gray-400">12/26</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="w-12 h-8 bg-[#0f1115] rounded flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00c853]">
                          <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"></path>
                          <rect x="9" y="9" width="6" height="6"></rect>
                        </svg>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Card Holder Name</p>
                      <p className="font-medium">Aldeen Nasrun M</p>
                    </div>
                    <div className="text-right">
                      <div className="w-16 h-8 bg-[#0f1115] rounded flex items-center justify-center mb-2">
                        <span className="text-xs font-bold">VISA</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Quick Action</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="bg-[#1d2129] hover:bg-[#2d3748] rounded-lg p-2 text-sm flex flex-col items-center">
                      <PlusIcon className="w-4 h-4 mb-1" />
                      <span>Top Up</span>
                    </button>
                    <button className="bg-[#1d2129] hover:bg-[#2d3748] rounded-lg p-2 text-sm flex flex-col items-center">
                      <ArrowUp className="w-4 h-4 mb-1" />
                      <span>Transfers</span>
                    </button>
                    <button className="bg-[#1d2129] hover:bg-[#2d3748] rounded-lg p-2 text-sm flex flex-col items-center">
                      <ArrowDown className="w-4 h-4 mb-1" />
                      <span>Request</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Daily Limit</h4>
                  <p className="text-xl font-bold mb-1">$1200 used <span className="text-gray-400">from $2,000 limit</span></p>
                  <div className="h-2 bg-[#1d2129] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 w-[60%]"></div>
                  </div>
                </div>
              </motion.div>
              
              {/* My Goals */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#13151a] rounded-xl p-6 border border-[#2d3748]/30"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">My Goals</h3>
                  <button className="text-sm text-[#00c853] hover:text-[#00b040] flex items-center">
                    <PlusIcon className="w-3 h-3 mr-1" />
                    Add Goals
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1d2129]">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#1d2129] flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00c853]">
                          <circle cx="12" cy="12" r="10"></circle>
                          <circle cx="12" cy="12" r="6"></circle>
                          <path d="M12 2v4"></path>
                          <path d="M12 18v4"></path>
                          <path d="M4.93 4.93l2.83 2.83"></path>
                          <path d="M16.24 16.24l2.83 2.83"></path>
                          <path d="M2 12h4"></path>
                          <path d="M18 12h4"></path>
                          <path d="M4.93 19.07l2.83-2.83"></path>
                          <path d="M16.24 7.76l2.83-2.83"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Nvidia RTX 5090</p>
                        <p className="text-xs text-gray-400">$2,340/$1,999</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1d2129]">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#1d2129] flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00c853]">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Samsung Galaxy S25 Ultra</p>
                        <p className="text-xs text-gray-400">$1,780/$799</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1d2129]">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#1d2129] flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00c853]">
                          <path d="M14 4v6a6 6 0 0 1-12 0V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"></path>
                          <circle cx="12" cy="14" r="4"></circle>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Fuji X1000 VI</p>
                        <p className="text-xs text-gray-400">$1,590/$892</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function PlusIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}


import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CreditCard, DollarSign, ArrowUp, ArrowDown, Search, Bell, Settings, Wallet, Users, CreditCardIcon, LogOut, ArrowRight, ChevronDown } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('Staking');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Animation controls for scroll-triggered animations
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Mock data for the staking assets
  const stakingAssets = [
    {
      name: "Ethereum (ETH)",
      icon: "ETH",
      color: "text-blue-400",
      rewardRate: "13.62%",
      change: "+0.25%",
      value: "$2,956",
      chartData: [30, 40, 35, 50, 49, 60, 70, 91, 140, 120, 130, 150, 170, 180, 190, 200, 220, 250, 280, 300, 320, 350, 380, 400]
    },
    {
      name: "BNB Chain",
      icon: "BNB",
      color: "text-yellow-400",
      rewardRate: "12.72%",
      change: "+0.67%",
      value: "$2,009",
      chartData: [20, 30, 25, 40, 39, 50, 60, 81, 130, 110, 120, 140, 160, 170, 180, 190, 210, 240, 270, 290, 310, 340, 370, 390]
    },
    {
      name: "Polygon (Matic)",
      icon: "MATIC",
      color: "text-purple-400",
      rewardRate: "6.29%",
      change: "-1.8%",
      value: "$9,987",
      chartData: [10, 20, 15, 30, 29, 40, 50, 71, 120, 100, 110, 130, 150, 160, 170, 180, 200, 230, 260, 280, 300, 330, 360, 380]
    }
  ];

  // Mock data for active stakings
  const activeStakings = [
    {
      name: "Avalance (AVAX)",
      symbol: "AVAX",
      amount: "31.39686",
      price: "$41.99",
      change: "-1.09%",
      stakingRatio: "60.6%",
      rewardRate: "2.23%",
      period: "4 Month"
    }
  ];

  // Animation variants for scroll-triggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Custom chart component
  const Chart = ({ data, color }) => {
    const maxValue = Math.max(...data);
    const height = 80;
    
    return (
      <div className="relative h-20 w-full mt-2">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700/50"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700/50" style={{ top: '33%' }}></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700/50" style={{ top: '66%' }}></div>
        
        <svg className="w-full h-full" viewBox={`0 0 ${data.length} 100`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <path
            d={data.map((value, index) => {
              const x = index;
              const y = 100 - (value / maxValue) * 90;
              return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          
          <path
            d={`${data.map((value, index) => {
              const x = index;
              const y = 100 - (value / maxValue) * 90;
              return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
            }).join(' ')} L ${data.length - 1} 100 L 0 100 Z`}
            fill={`url(#gradient-${color})`}
            stroke="none"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-black/50 border-b border-gray-700/50 h-14 flex items-center px-4 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 flex items-center space-x-2">
          <div className="w-4 h-4 rounded-sm bg-purple-500"></div>
          <span className="text-sm">stakent.com</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-black/50 backdrop-blur-sm rounded-lg pl-10 pr-4 py-1.5 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm font-medium">
            R
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar Navigation */}
        <aside className="w-16 bg-black/50 border-r border-gray-700/50 flex flex-col items-center py-4 backdrop-blur-sm">
          <div className="w-8 h-8 mb-6">
            <div className="w-full h-full rounded-sm bg-purple-500"></div>
          </div>
          
          <nav className="flex flex-col space-y-6 mt-8">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-500/20">
              <Wallet className="w-4 h-4 text-purple-400" />
            </div>
            
            <div className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-purple-500/10">
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            
            <div className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-purple-500/10">
              <CreditCardIcon className="w-4 h-4 text-gray-400" />
            </div>
            
            <div className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-purple-500/10">
              <Settings className="w-4 h-4 text-gray-400" />
            </div>
          </nav>
          
          <div className="mt-auto mb-6">
            <LogOut className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Good Afternoon Ryan!</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Staking Tab */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mr-2">
                        <Wallet className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">Staking</h3>
                        <p className="text-sm text-gray-400">Active</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        className={`px-3 py-1 text-sm rounded-lg mr-2 ${activeTab === 'Staking' ? 'bg-purple-500/30 text-purple-400' : 'bg-black/50 text-gray-400'}`}
                        onClick={() => setActiveTab('Staking')}
                      >
                        Staking
                      </button>
                      <button 
                        className={`px-3 py-1 text-sm rounded-lg ${activeTab === 'Stablecoin' ? 'bg-purple-500/30 text-purple-400' : 'bg-black/50 text-gray-400'}`}
                        onClick={() => setActiveTab('Stablecoin')}
                      >
                        Stablecoin
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-gray-400 text-sm mb-1">Total Staked</p>
                    <h2 className="text-3xl font-bold mb-1">$42,856.00</h2>
                    <div className="flex items-center text-sm">
                      <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-500">+12.5%</span>
                      <span className="text-gray-400 ml-1">from last month</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Liquid Staking Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mr-2">
                        <CreditCard className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">Liquid Staking</h3>
                        <p className="text-sm text-gray-400">Beta</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-purple-400 mr-2">New</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-gray-400 text-sm mb-1">Total Liquid Staked</p>
                    <h2 className="text-3xl font-bold mb-1">$12,450.00</h2>
                    <div className="flex items-center text-sm">
                      <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-500">+8.7%</span>
                      <span className="text-gray-400 ml-1">from last month</span>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Top Staking Assets */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Top Staking Assets</h3>
                  <div className="flex">
                    <button className="px-3 py-1 text-sm rounded-lg bg-black/50 hover:bg-black/70 mr-2">24H</button>
                    <button className="px-3 py-1 text-sm rounded-lg bg-black/50 hover:bg-black/70 mr-2">Proof of Stake</button>
                    <button className="px-3 py-1 text-sm rounded-lg bg-black/50 hover:bg-black/70">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stakingAssets.map((asset, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-purple-500/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center mr-3 ${asset.color}`}>
                            <span className="font-bold">{asset.icon}</span>
                          </div>
                          <div>
                            <p className="font-medium">{asset.name}</p>
                            <p className="text-xs text-gray-400">Proof of Stake</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl">{asset.rewardRate}</p>
                          <p className={`text-xs ${asset.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{asset.change}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Current Value</span>
                        <span className="font-medium">{asset.value}</span>
                      </div>
                      
                      <Chart data={asset.chartData} color={asset.color.replace('text-', '')} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Active Stakings */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Your active stakings</h3>
                  <div className="flex items-center space-x-2">
                    <button className="text-sm text-purple-400 hover:text-purple-300">View All</button>
                    <button className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {activeStakings.map((staking, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center mr-3">
                            <span className="font-bold text-purple-400 text-xl">{staking.symbol}</span>
                          </div>
                          <div>
                            <p className="font-medium text-xl">Stake {staking.name}</p>
                            <p className="text-sm text-gray-400">Current Reward Balance: {staking.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-3xl mb-1">{staking.amount}</p>
                          <div className="flex items-center">
                            <button className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg mr-2 hover:bg-purple-500/30">Upgrade</button>
                            <button className="bg-black/50 text-gray-400 px-3 py-1 rounded-lg hover:bg-black/70">Unstake</button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="p-3 rounded-lg bg-black/50">
                          <p className="text-xs text-gray-400 mb-1">Momentum</p>
                          <p className="font-medium text-lg">Growth dynamics</p>
                          <p className="text-sm text-red-500 mt-1">-0.82%</p>
                        </div>
                        <div className="p-3 rounded-lg bg-black/50">
                          <p className="text-xs text-gray-400 mb-1">General</p>
                          <p className="font-medium text-lg">Overview</p>
                          <p className="text-xs text-gray-400 mt-1">24H</p>
                        </div>
                        <div className="p-3 rounded-lg bg-black/50">
                          <p className="text-xs text-gray-400 mb-1">Risk</p>
                          <p className="font-medium text-lg">Risk assessment</p>
                          <p className="text-xs text-gray-400 mt-1">24H</p>
                        </div>
                        <div className="p-3 rounded-lg bg-black/50">
                          <p className="text-xs text-gray-400 mb-1">Reward</p>
                          <p className="font-medium text-lg">Expected profit</p>
                          <p className="text-xs text-gray-400 mt-1">24H</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div className="p-3 rounded-lg bg-black/50">
                          <p className="text-xs text-gray-400 mb-1">Staked Tokens Trend</p>
                          <p className="font-medium text-lg">-0.82%</p>
                          <p className="text-xs text-gray-400 mt-1">24H</p>
                        </div>
                        <div className="p-3 rounded-lg bg-black/50">
                          <p className="text-xs text-gray-400 mb-1">Price</p>
                          <p className="font-medium text-lg">${staking.price}</p>
                          <p className={`text-xs ${staking.change.startsWith('-') ? 'text-red-500' : 'text-green-500'} mt-1`}>{staking.change}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-black/50">
                          <p className="text-xs text-gray-400 mb-1">Staking Ratio</p>
                          <p className="font-medium text-lg">{staking.stakingRatio}</p>
                          <p className="text-xs text-gray-400 mt-1">24H</p>
                        </div>
                        <div className="p-3 rounded-lg bg-black/50">
                          <p className="text-xs text-gray-400 mb-1">Reward Rate</p>
                          <p className="font-medium text-lg">{staking.rewardRate}</p>
                          <p className="text-xs text-gray-400 mt-1">24H Ago</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Liquid Staking Portfolio */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-black/50 flex items-center justify-center mr-2">
                      <div className="w-4 h-4 rounded-sm bg-purple-500"></div>
                    </div>
                    <span className="font-medium">Liquid Staking Portfolio</span>
                  </div>
                  <button className="text-sm bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg hover:bg-purple-500/30">New</button>
                </div>
                
                <p className="text-gray-300 text-sm mb-6">
                  An all-in-one portfolio that helps you make smarter investments into Ethereum Liquid Staking
                </p>
                
                <button className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg mb-3 hover:bg-purple-600 transition-colors flex items-center justify-center">
                  <span>Connect with Wallet</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <path d="M14 12v-1a2 2 0 0 0-4 0v1a2 2 0 0 1-4 0v-3a8 8 0 1 1 16 0v3a2 2 0 0 1-4 0z"></path>
                  </svg>
                </button>
                
                <button className="w-full bg-black/50 border border-purple-500/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors flex items-center justify-center">
                  <span>Enter a Wallet Address</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <path d="M14 12v-1a2 2 0 0 0-4 0v1a2 2 0 0 1-4 0v-3a8 8 0 1 1 16 0v3a2 2 0 0 1-4 0z"></path>
                  </svg>
                </button>
              </motion.div>
              
              {/* Investment Period */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <h4 className="font-medium mb-4">Investment Period</h4>
                <p className="text-sm text-gray-400 mb-2">Contribution Period (Month)</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-gray-400">1 Month</span>
                  <span className="text-xs text-gray-400">12 Month</span>
                </div>
                
                <div className="relative h-2 bg-gray-700/50 rounded-full mb-4">
                  <div className="absolute top-0 left-0 h-2 bg-purple-500 rounded-full w-1/4"></div>
                  <div className="absolute top-1/2 transform -translate-y-1/2 left-1/4 w-4 h-4 bg-purple-500 rounded-full border-2 border-black"></div>
                </div>
                
                <div className="flex justify-between">
                  <button className="px-3 py-1 bg-black/50 rounded-lg text-sm">1 Month</button>
                  <button className="px-3 py-1 bg-black/50 rounded-lg text-sm">2 Month</button>
                  <button className="px-3 py-1 bg-purple-500/30 rounded-lg text-sm text-purple-400">4 Month</button>
                  <button className="px-3 py-1 bg-black/50 rounded-lg text-sm">6 Month</button>
                </div>
              </motion.div>
              
              {/* Quick Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <h4 className="font-medium mb-4">Quick Actions</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-purple-500/20 hover:bg-purple-500/30 text-white px-4 py-3 rounded-lg flex flex-col items-center transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center mb-2">
                      <ArrowUp className="w-5 h-5" />
                    </div>
                    <span className="text-sm">Deposit</span>
                  </button>
                  
                  <button className="bg-purple-500/20 hover:bg-purple-500/30 text-white px-4 py-3 rounded-lg flex flex-col items-center transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center mb-2">
                      <ArrowDown className="w-5 h-5" />
                    </div>
                    <span className="text-sm">Withdraw</span>
                  </button>
                  
                  <button className="bg-purple-500/20 hover:bg-purple-500/30 text-white px-4 py-3 rounded-lg flex flex-col items-center transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center mb-2">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-sm">Swap</span>
                  </button>
                  
                  <button className="bg-purple-500/20 hover:bg-purple-500/30 text-white px-4 py-3 rounded-lg flex flex-col items-center transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center mb-2">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-sm">Stake</span>
                  </button>
                </div>
              </motion.div>
              
              {/* Recent Activity */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Recent Activity</h4>
                  <button className="text-sm text-purple-400 hover:text-purple-300">View All</button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/30">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center mr-3">
                        <ArrowUp className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Staked 5.25 ETH</p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-500">+5.25 ETH</p>
                      <p className="text-xs text-gray-400">$1,845.25</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/30">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center mr-3">
                        <ArrowDown className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium">Unstaked 2.1 AVAX</p>
                        <p className="text-xs text-gray-400">5 hours ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-500">-2.1 AVAX</p>
                      <p className="text-xs text-gray-400">$87.50</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/30">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center mr-3">
                        <DollarSign className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">Earned Reward</p>
                        <p className="text-xs text-gray-400">1 day ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-purple-400">+0.35 ETH</p>
                      <p className="text-xs text-gray-400">$123.75</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CreditCard, DollarSign, ArrowUp, ArrowDown, Search, Bell, Settings, Wallet, Users, CreditCardIcon, LogOut, ChevronDown, ChevronUp } from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  
  // Animation controls for scroll-triggered animations
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Mock data for cards
  const cards = [
    {
      id: 1,
      name: "Lusiana",
      number: "3455 4562 7710 3507",
      expiry: "02/30",
      type: "VISA",
      color: "from-green-400 to-blue-500"
    },
    {
      id: 2,
      name: "Lusiana",
      number: "5281 7654 3210 9876",
      expiry: "11/28",
      type: "MASTERCARD",
      color: "from-purple-500 to-pink-500"
    }
  ];

  // Mock data for recent payments
  const recentPayments = [
    { id: 1, name: "Spotify", amount: "$20.36", icon: "S", color: "bg-green-500" },
    { id: 2, name: "Dribbble", amount: "$56.10", icon: "D", color: "bg-purple-500" },
    { id: 3, name: "Netflix", amount: "$20.00", icon: "N", color: "bg-red-500" }
  ];

  // Mock data for analytics
  const analyticsData = [
    { month: "Jan", income: 25000, outcome: 15000 },
    { month: "Feb", income: 32000, outcome: 22000 },
    { month: "Mar", income: 28000, outcome: 18000 },
    { month: "Apr", income: 35000, outcome: 25000 },
    { month: "May", income: 40000, outcome: 20000 },
    { month: "Jun", income: 30000, outcome: 22000 },
    { month: "Jul", income: 33000, outcome: 24000 },
    { month: "Aug", income: 36000, outcome: 26000 }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Custom chart component for analytics
  const AnalyticsChart = () => {
    const maxIncome = Math.max(...analyticsData.map(d => d.income));
    const maxOutcome = Math.max(...analyticsData.map(d => d.outcome));
    const max = Math.max(maxIncome, maxOutcome);
    
    return (
      <div className="relative h-64 w-full mt-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
          <span>40K</span>
          <span>30K</span>
          <span>20K</span>
          <span>10K</span>
          <span>0</span>
        </div>
        
        {/* Chart content */}
        <div className="absolute left-8 right-0 top-0 bottom-0 flex items-end justify-between px-2">
          {analyticsData.map((data, index) => {
            const incomeHeight = (data.income / max) * 100;
            const outcomeHeight = (data.outcome / max) * 100;
            
            return (
              <div key={index} className="flex flex-col items-center w-10">
                <div className="relative h-52 flex flex-col items-center">
                  {/* Outcome bar */}
                  <div 
                    className="w-4 bg-green-500 rounded-t-sm mb-1"
                    style={{ height: `${outcomeHeight}%` }}
                  ></div>
                  
                  {/* Income bar */}
                  <div 
                    className="w-4 bg-blue-500 rounded-t-sm"
                    style={{ height: `${incomeHeight}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400 mt-2">{data.month}</span>
              </div>
            );
          })}
        </div>
        
        {/* Highlight for current month */}
        <div className="absolute left-[calc(50%+2rem)] w-0.5 h-56 bg-yellow-500 top-0" style={{ transform: 'translateX(-50%)' }}>
          <div className="absolute -top-12 w-20 h-8 bg-black/80 border border-yellow-500 rounded px-2 py-1 text-xs text-yellow-500">
            May 2023
            <br />
            $40k
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-black/50 border-b border-gray-700/50 h-14 flex items-center px-4 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 flex items-center space-x-2">
          <div className="w-4 h-4 rounded-sm bg-[#00c853]"></div>
          <span className="text-sm">forex.com</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search for anything..." 
              className="bg-black/50 backdrop-blur-sm rounded-lg pl-10 pr-4 py-1.5 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-[#00c853]"
            />
          </div>
          <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-[#00c853] flex items-center justify-center text-sm font-medium">
            L
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-black/50 border-r border-gray-700/50 flex flex-col py-6 px-4 backdrop-blur-sm">
          <div className="flex items-center mb-8 px-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200">FOREX</span>
          </div>
          
          <nav className="flex flex-col space-y-2">
            <button 
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'Dashboard' ? 'bg-[#00c853]/20 text-[#00c853]' : 'hover:bg-black/30'}`}
              onClick={() => setActiveTab('Dashboard')}
            >
              <div className="w-6 h-6 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <span>Dashboard</span>
            </button>
            
            <button 
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'Analytics' ? 'bg-[#00c853]/20 text-[#00c853]' : 'hover:bg-black/30'}`}
              onClick={() => setActiveTab('Analytics')}
            >
              <div className="w-6 h-6 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <span>Analytics</span>
            </button>
            
            <div className="relative">
              <button 
                className={`flex items-center px-4 py-3 rounded-xl transition-all w-full ${activeTab === 'My Wallet' ? 'bg-[#00c853]/20 text-[#00c853]' : 'hover:bg-black/30'}`}
                onClick={() => setShowWalletMenu(!showWalletMenu)}
              >
                <div className="w-6 h-6 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"></path>
                    <polyline points="16 10 20 14 16 18"></polyline>
                  </svg>
                </div>
                <span>My Wallet</span>
                {showWalletMenu ? (
                  <ChevronUp className="ml-auto text-gray-400" />
                ) : (
                  <ChevronDown className="ml-auto text-gray-400" />
                )}
              </button>
              
              {showWalletMenu && (
                <div className="ml-12 mt-2 space-y-1">
                  <button className="flex items-center px-4 py-2 rounded-lg hover:bg-black/30 w-full text-sm">
                    <span>Credit Cards</span>
                  </button>
                  <button className="flex items-center px-4 py-2 rounded-lg hover:bg-black/30 w-full text-sm">
                    <span>Bank Accounts</span>
                  </button>
                  <button className="flex items-center px-4 py-2 rounded-lg hover:bg-black/30 w-full text-sm">
                    <span>Crypto Wallets</span>
                  </button>
                </div>
              )}
            </div>
            
            <button 
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'Accounts' ? 'bg-[#00c853]/20 text-[#00c853]' : 'hover:bg-black/30'}`}
              onClick={() => setActiveTab('Accounts')}
            >
              <div className="w-6 h-6 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-4-4H11a4 4 0 0 0-4 4v2"></path>
                  <circle cx="15" cy="7" r="4"></circle>
                </svg>
              </div>
              <span>Accounts</span>
            </button>
            
            <button 
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'Settings' ? 'bg-[#00c853]/20 text-[#00c853]' : 'hover:bg-black/30'}`}
              onClick={() => setActiveTab('Settings')}
            >
              <div className="w-6 h-6 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1.51 1 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1h.09a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              <span>Settings</span>
            </button>
            
            <button 
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'Security' ? 'bg-[#00c853]/20 text-[#00c853]' : 'hover:bg-black/30'}`}
              onClick={() => setActiveTab('Security')}
            >
              <div className="w-6 h-6 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <span>Security</span>
            </button>
            
            <button 
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'Help Centre' ? 'bg-[#00c853]/20 text-[#00c853]' : 'hover:bg-black/30'}`}
              onClick={() => setActiveTab('Help Centre')}
            >
              <div className="w-6 h-6 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <span>Help Centre</span>
            </button>
          </nav>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-black/30">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#00c853]/20 flex items-center justify-center mr-3">
                  <span className="font-medium">L</span>
                </div>
                <div>
                  <p className="font-medium">Lusiana Angela</p>
                  <p className="text-xs text-gray-400">Edit Profile</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">Dark Mode</span>
                  <div className="relative w-12 h-6 rounded-full bg-gray-700 flex items-center p-1">
                    <div 
                      className={`w-4 h-4 rounded-full bg-[#00c853] transition-all ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Welcome Back, Lusiana <span className="text-[#00c853]">💫</span></h1>
            <p className="text-gray-400">Here's what's happening with your store today.</p>
          </div>
          
          <motion.div 
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column - Cards Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* My Cards */}
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">My Cards</h3>
                    <button className="text-sm text-gray-400 hover:text-white">See All</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map(card => (
                      <motion.div
                        key={card.id}
                        whileHover={{ scale: 1.03 }}
                        className="relative rounded-xl overflow-hidden h-40"
                      >
                        <div className={`w-full h-full bg-gradient-to-r ${card.color} p-6`}>
                          <div className="flex justify-between items-start">
                            <div className="text-white">
                              <div className="text-xs mb-4">VISA</div>
                              <div className="text-2xl font-bold mb-2">{card.number}</div>
                              <div className="text-xs">{card.name} • {card.expiry}</div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                              <span className="text-white text-xl">V</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="border-2 border-dashed border-gray-600 rounded-xl h-40 flex items-center justify-center cursor-pointer hover:border-[#00c853]"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-[#00c853]/10 flex items-center justify-center mb-3 mx-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00c853]">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </div>
                        <h4 className="font-medium">Add New Card</h4>
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Recent Payments */}
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Recent Payments</h3>
                    <div className="flex items-center space-x-2">
                      <button className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                      </button>
                      <button className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"></path>
                          <line x1="12" y1="8" x2="12" y2="16"></line>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recentPayments.map(payment => (
                      <motion.div
                        key={payment.id}
                        whileHover={{ scale: 1.05 }}
                        className="bg-black/30 rounded-xl p-4 hover:border-[#00c853] border border-transparent transition-all"
                      >
                        <div className={`w-12 h-12 rounded-xl ${payment.color} flex items-center justify-center mb-3 mx-auto`}>
                          <span className="text-white font-bold">{payment.icon}</span>
                        </div>
                        <h4 className="text-center font-medium">{payment.name}</h4>
                        <p className="text-center text-[#00c853] mt-1">{payment.amount}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Metrics Section */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div variants={itemVariants} className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-gradient-to-r from-green-400 to-green-200 rounded-xl">
                      <DollarSign className="w-5 h-5 text-black" />
                    </div>
                    <div className="text-xs text-gray-400">Balance</div>
                  </div>
                  <h3 className="text-2xl font-bold mt-4">$2545.44</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-red-500 text-sm">-12.45%</span>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-gradient-to-r from-blue-400 to-blue-200 rounded-xl">
                      <DollarSign className="w-5 h-5 text-black" />
                    </div>
                    <div className="text-xs text-gray-400">Income</div>
                  </div>
                  <h3 className="text-2xl font-bold mt-4">$1423.00</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-green-500 text-sm">+05.00%</span>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-gradient-to-r from-purple-400 to-purple-200 rounded-xl">
                      <DollarSign className="w-5 h-5 text-black" />
                    </div>
                    <div className="text-xs text-gray-400">Saving</div>
                  </div>
                  <h3 className="text-2xl font-bold mt-4">$89.00</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-green-500 text-sm">+10.00%</span>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-gradient-to-r from-red-400 to-red-200 rounded-xl">
                      <DollarSign className="w-5 h-5 text-black" />
                    </div>
                    <div className="text-xs text-gray-400">Expenses</div>
                  </div>
                  <h3 className="text-2xl font-bold mt-4">$1423.00</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-red-500 text-sm">-05.00%</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Right Column - Analytics Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Analytics</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                      <span>Income</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                      <span>Outcome</span>
                    </div>
                    <div className="flex items-center bg-black/50 rounded-lg px-2 py-1 text-xs">
                      <span>2023</span>
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                </div>
                
                <AnalyticsChart />
              </div>
              
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h4 className="font-medium mb-4">Top Performing Categories</h4>
                <div className="space-y-4">
                  {[
                    { name: "Entertainment", amount: "$2,450", percent: "32%", color: "bg-green-500" },
                    { name: "Shopping", amount: "$1,890", percent: "25%", color: "bg-blue-500" },
                    { name: "Food & Dining", amount: "$1,450", percent: "19%", color: "bg-purple-500" },
                    { name: "Travel", amount: "$1,200", percent: "16%", color: "bg-yellow-500" }
                  ].map((category, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{category.name}</span>
                        <span className="text-sm">{category.amount}</span>
                      </div>
                      <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                        <div className={`${category.color} h-full`} style={{ width: category.percent }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h4 className="font-medium mb-4">Upcoming Bills</h4>
                <div className="space-y-4">
                  {[
                    { name: "Netflix", amount: "$20.00", date: "15/07", color: "bg-red-500" },
                    { name: "Spotify", amount: "$15.99", date: "18/07", color: "bg-green-500" },
                    { name: "Amazon Prime", amount: "$12.99", date: "22/07", color: "bg-blue-500" }
                  ].map((bill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-black/30">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full ${bill.color} flex items-center justify-center mr-3`}>
                          <span className="text-white font-medium">{bill.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{bill.name}</p>
                          <p className="text-xs text-gray-400">Due {bill.date}</p>
                        </div>
                      </div>
                      <p className="font-medium">{bill.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}


login and sigu up 


import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, CheckCircle, Google, Apple, Facebook } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = re.test(email);
    setIsEmailValid(isValid);
    return isValid;
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
    return strength >= 3;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (!email || !password) {
      setLoginError('Please fill in all fields');
      return;
    }
    
    if (!isEmailValid) {
      setLoginError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const isSuccessful = Math.random() > 0.3; // 70% success rate for demo
      
      if (isSuccessful) {
        setLoginError('');
        // In a real app, this would redirect to dashboard
        alert('Login successful!');
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    }, 1000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterError('');
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setRegisterError('Please fill in all fields');
      return;
    }
    
    if (!isEmailValid) {
      setRegisterError('Please enter a valid email address');
      return;
    }
    
    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    
    if (passwordStrength < 3) {
      setRegisterError('Password is not strong enough. Please include uppercase, lowercase, numbers, and special characters.');
      return;
    }
    
    if (!termsAccepted) {
      setRegisterError('You must agree to the Terms and Privacy Policy');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const isSuccessful = Math.random() > 0.2; // 80% success rate for demo
      
      if (isSuccessful) {
        setRegisterError('');
        // In a real app, this would redirect to verification page
        alert('Registration successful! Please verify your email.');
      } else {
        setRegisterError('Registration failed. Please try again later.');
      }
    }, 1000);
  };

  const passwordStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    if (passwordStrength >= 4) return 'Strong';
  };

  const passwordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-300';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    if (passwordStrength >= 4) return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md mr-2"></div>
          <h1 className="text-xl font-bold text-gray-900">XUPAY</h1>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Help</a>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Privacy</a>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Terms</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left Side - Form Card */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {activeTab === 'login' ? 'Welcome Back' : 'Create Your Account'}
              </h2>
              <p className="text-gray-600">
                {activeTab === 'login' 
                  ? 'Log in to manage your wallets and payments securely' 
                  : 'Join thousands of users managing their finances with XUPAY'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex mb-6 rounded-xl overflow-hidden border border-gray-200">
              <button
                className={`flex-1 py-3 font-medium transition-colors ${
                  activeTab === 'login'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-3 font-medium transition-colors ${
                  activeTab === 'register'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('register')}
              >
                Sign Up
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {loginError}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateEmail(e.target.value);
                      }}
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        isEmailValid === null
                          ? 'border-gray-300'
                          : isEmailValid
                          ? 'border-green-500'
                          : 'border-red-500'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="your@email.com"
                    />
                    {isEmailValid !== null && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {isEmailValid ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="text-xs text-red-500">Invalid</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Remember me
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                    isLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Logging in...
                    </div>
                  ) : (
                    'Log in'
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Google className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Apple className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Facebook className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-center text-sm text-gray-600">
                  <span>Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-6">
                {registerError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {registerError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateEmail(e.target.value);
                      }}
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        isEmailValid === null
                          ? 'border-gray-300'
                          : isEmailValid
                          ? 'border-green-500'
                          : 'border-red-500'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="your@email.com"
                    />
                    {isEmailValid !== null && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {isEmailValid ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="text-xs text-red-500">Invalid</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        checkPasswordStrength(e.target.value);
                      }}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-1">
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${passwordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Password strength: {passwordStrengthLabel()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-500">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-500">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                    isLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </div>
                  ) : (
                    'Create account'
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Google className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Apple className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Facebook className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-center text-sm text-gray-600">
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Log in
                  </button>
                </p>
              </form>
            )}

            {/* Security Note */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Secure login.</span> Your credentials are encrypted
                  with bank-grade security. We never share your data with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Marketing Panel (Desktop Only) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-50 items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Manage all your wallets in one place
            </h3>
            
            <p className="text-gray-600 mb-6">
              XUPAY provides a secure, intuitive platform for managing your digital assets. 
              With advanced security features and seamless integration, you can focus on growing your wealth.
            </p>
            
            <ul className="space-y-3 text-left">
              <li className="flex items-start">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-gray-700">Bank-grade encryption for all transactions</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-gray-700">Real-time portfolio tracking and analytics</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-gray-700">24/7 customer support with instant help</span>
              </li>
            </ul>
            
            <div className="mt-8">
              <a
                href="#"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium"
              >
                Learn more about our security features
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} XUPAY. All rights reserved.</p>
        <p className="mt-1">
          This is a demo interface. In a production environment, all data would be encrypted and secure.
        </p>
      </footer>
    </div>
  );
}


transaction and history and wallaet page similar a like still dashboard wtill with componets block visulise 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction History - XUPAY</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f9fafb;
        }
        
        .transaction-row {
            transition: all 0.2s ease;
        }
        
        .transaction-row:hover {
            background-color: #f3f4f6;
            transform: translateY(-2px);
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        
        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
        }
        
        .status-success {
            background-color: #d4edda;
            color: #155724;
        }
        
        .status-pending {
            background-color: #fff3cd;
            color: #856404;
        }
        
        .status-failed {
            background-color: #f8d7da;
            color: #721c24;
        }
        
        .type-icon {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
        }
        
        .type-sent {
            background-color: #f8d7da;
            color: #721c24;
        }
        
        .type-received {
            background-color: #d4edda;
            color: #155724;
        }
        
        .skeleton {
            animation: pulse 1.5s infinite ease-in-out;
        }
        
        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.9; }
            100% { opacity: 0.6; }
        }
        
        .sticky-header {
            position: sticky;
            top: 0;
            background: white;
            z-index: 10;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        @media (max-width: 768px) {
            .desktop-only {
                display: none;
            }
        }
    </style>
</head>
<body class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="w-full py-4 px-6 flex justify-between items-center border-b border-gray-200 bg-white">
        <div class="flex items-center">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md mr-2"></div>
            <h1 class="text-xl font-bold text-gray-900">XUPAY</h1>
        </div>
        <div class="flex items-center space-x-4">
            <a href="#" class="text-sm text-gray-600 hover:text-blue-600">Help</a>
            <a href="#" class="text-sm text-gray-600 hover:text-blue-600">Privacy</a>
            <a href="#" class="text-sm text-gray-600 hover:text-blue-600">Terms</a>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-6 py-8">
        <!-- Top Section: Title and Filters -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div class="mb-4 md:mb-0">
                <h1 class="text-2xl font-bold text-gray-900">Transactions</h1>
                <p class="text-gray-600">All payments across your wallets</p>
            </div>
            
            <div class="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <div class="relative">
                    <select class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Last 30 days</option>
                        <option>Last 7 days</option>
                        <option>Last 3 months</option>
                        <option>Custom range</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                
                <div class="relative">
                    <select class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>All wallets</option>
                        <option>Main Wallet</option>
                        <option>Secondary Wallet</option>
                        <option>Crypto Wallet</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                
                <div class="flex space-x-2">
                    <button class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">All</button>
                    <button class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">Sent</button>
                    <button class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">Received</button>
                    <button class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">Failed</button>
                </div>
            </div>
        </div>
        
        <!-- Search Bar -->
        <div class="mb-6">
            <div class="relative">
                <input type="text" placeholder="Search by name, amount, reference..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
        </div>
        
        <!-- Summary Row (Optional) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-white border border-gray-200 rounded-xl p-4">
                <p class="text-sm text-gray-500">Total sent (30d)</p>
                <p class="text-2xl font-bold text-gray-900">$2,450.00</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-xl p-4">
                <p class="text-sm text-gray-500">Total received (30d)</p>
                <p class="text-2xl font-bold text-gray-900">$3,890.00</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-xl p-4">
                <p class="text-sm text-gray-500">Number of transactions</p>
                <p class="text-2xl font-bold text-gray-900">24</p>
            </div>
        </div>
        
        <!-- Transaction List (Desktop) -->
        <div class="desktop-only">
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div class="sticky-header px-6 py-3 border-b border-gray-200 bg-gray-50">
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-2 font-medium text-gray-600">Date & Time</div>
                        <div class="col-span-3 font-medium text-gray-600">Description</div>
                        <div class="col-span-2 font-medium text-gray-600">Wallet / Currency</div>
                        <div class="col-span-1 font-medium text-gray-600">Type</div>
                        <div class="col-span-2 font-medium text-gray-600 text-right">Amount</div>
                        <div class="col-span-1 font-medium text-gray-600">Status</div>
                        <div class="col-span-1"></div>
                    </div>
                </div>
                
                <div class="divide-y divide-gray-200">
                    <!-- Transaction Row 1 -->
                    <div class="transaction-row px-6 py-4 hover:bg-gray-50 cursor-pointer">
                        <div class="grid grid-cols-12 gap-4 items-center">
                            <div class="col-span-2">
                                <p class="font-medium">02 Apr 2025</p>
                                <p class="text-xs text-gray-500">8:15 am</p>
                            </div>
                            <div class="col-span-3">
                                <p class="font-medium">Meta Quest 3</p>
                                <p class="text-sm text-gray-500">512GB • White</p>
                            </div>
                            <div class="col-span-2">
                                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Main Wallet • USD</span>
                            </div>
                            <div class="col-span-1">
                                <div class="type-icon type-sent">
                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                </div>
                            </div>
                            <div class="col-span-2 text-right">
                                <p class="font-medium text-red-600">-$499.00</p>
                                <p class="text-xs text-gray-500">+0.5% fee</p>
                            </div>
                            <div class="col-span-1">
                                <span class="status-badge status-success">Success</span>
                            </div>
                            <div class="col-span-1 text-right">
                                <button class="text-gray-400 hover:text-gray-600">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Transaction Row 2 -->
                    <div class="transaction-row px-6 py-4 hover:bg-gray-50 cursor-pointer">
                        <div class="grid grid-cols-12 gap-4 items-center">
                            <div class="col-span-2">
                                <p class="font-medium">06 Apr 2025</p>
                                <p class="text-xs text-gray-500">6:45 pm</p>
                            </div>
                            <div class="col-span-3">
                                <p class="font-medium">iPhone 15 Pro Max</p>
                                <p class="text-sm text-gray-500">512GB • eSIM</p>
                            </div>
                            <div class="col-span-2">
                                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Main Wallet • USD</span>
                            </div>
                            <div class="col-span-1">
                                <div class="type-icon type-sent">
                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                </div>
                            </div>
                            <div class="col-span-2 text-right">
                                <p class="font-medium text-red-600">-$1,399.00</p>
                                <p class="text-xs text-gray-500">+0.5% fee</p>
                            </div>
                            <div class="col-span-1">
                                <span class="status-badge status-success">Success</span>
                            </div>
                            <div class="col-span-1 text-right">
                                <button class="text-gray-400 hover:text-gray-600">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Transaction Row 3 -->
                    <div class="transaction-row px-6 py-4 hover:bg-gray-50 cursor-pointer">
                        <div class="grid grid-cols-12 gap-4 items-center">
                            <div class="col-span-2">
                                <p class="font-medium">10 Apr 2025</p>
                                <p class="text-xs text-gray-500">11:30 am</p>
                            </div>
                            <div class="col-span-3">
                                <p class="font-medium">MacBook Air M3 (13")</p>
                                <p class="text-sm text-gray-500">M3 chip • Ultra-light</p>
                            </div>
                            <div class="col-span-2">
                                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Main Wallet • USD</span>
                            </div>
                            <div class="col-span-1">
                                <div class="type-icon type-sent">
                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                </div>
                            </div>
                            <div class="col-span-2 text-right">
                                <p class="font-medium text-red-600">-$1,299.00</p>
                                <p class="text-xs text-gray-500">+0.5% fee</p>
                            </div>
                            <div class="col-span-1">
                                <span class="status-badge status-success">Success</span>
                            </div>
                            <div class="col-span-1 text-right">
                                <button class="text-gray-400 hover:text-gray-600">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Transaction Row 4 -->
                    <div class="transaction-row px-6 py-4 hover:bg-gray-50 cursor-pointer">
                        <div class="grid grid-cols-12 gap-4 items-center">
                            <div class="col-span-2">
                                <p class="font-medium">14 Apr 2025</p>
                                <p class="text-xs text-gray-500">7:50 pm</p>
                            </div>
                            <div class="col-span-3">
                                <p class="font-medium">AirPods Pro</p>
                                <p class="text-sm text-gray-500">2nd Gen • USB-C case</p>
                            </div>
                            <div class="col-span-2">
                                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Main Wallet • USD</span>
                            </div>
                            <div class="col-span-1">
                                <div class="type-icon type-sent">
                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                </div>
                            </div>
                            <div class="col-span-2 text-right">
                                <p class="font-medium text-red-600">-$229.00</p>
                                <p class="text-xs text-gray-500">+0.5% fee</p>
                            </div>
                            <div class="col-span-1">
                                <span class="status-badge status-success">Success</span>
                            </div>
                            <div class="col-span-1 text-right">
                                <button class="text-gray-400 hover:text-gray-600">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Transaction Row 5 -->
                    <div class="transaction-row px-6 py-4 hover:bg-gray-50 cursor-pointer">
                        <div class="grid grid-cols-12 gap-4 items-center">
                            <div class="col-span-2">
                                <p class="font-medium">18 Apr 2025</p>
                                <p class="text-xs text-gray-500">9:05 am</p>
                            </div>
                            <div class="col-span-3">
                                <p class="font-medium">Apple Vision Pro</p>
                                <p class="text-sm text-gray-500">AR Headset</p>
                            </div>
                            <div class="col-span-2">
                                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Main Wallet • USD</span>
                            </div>
                            <div class="col-span-1">
                                <div class="type-icon type-sent">
                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                </div>
                            </div>
                            <div class="col-span-2 text-right">
                                <p class="font-medium text-red-600">-$3,499.00</p>
                                <p class="text-xs text-gray-500">+0.5% fee</p>
                            </div>
                            <div class="col-span-1">
                                <span class="status-badge status-success">Success</span>
                            </div>
                            <div class="col-span-1 text-right">
                                <button class="text-gray-400 hover:text-gray-600">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Transaction List (Mobile) -->
        <div class="md:hidden">
            <div class="space-y-4">
                <!-- Transaction Card 1 -->
                <div class="bg-white rounded-xl border border-gray-200 p-4 transaction-row hover:bg-gray-50 cursor-pointer">
                    <div class="flex justify-between mb-2">
                        <div class="flex items-center">
                            <div class="type-icon type-sent mr-2">
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </div>
                            <span class="font-medium">Meta Quest 3</span>
                        </div>
                        <div class="text-right">
                            <p class="font-medium text-red-600">-$499.00</p>
                            <span class="status-badge status-success">Success</span>
                        </div>
                    </div>
                    <div class="flex justify-between text-sm text-gray-500 mb-2">
                        <span>02 Apr 2025 • 8:15 am</span>
                        <span>512GB • White</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Main Wallet • USD</span>
                        <button class="text-gray-400 hover:text-gray-600">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Transaction Card 2 -->
                <div class="bg-white rounded-xl border border-gray-200 p-4 transaction-row hover:bg-gray-50 cursor-pointer">
                    <div class="flex justify-between mb-2">
                        <div class="flex items-center">
                            <div class="type-icon type-sent mr-2">
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </div>
                            <span class="font-medium">iPhone 15 Pro Max</span>
                        </div>
                        <div class="text-right">
                            <p class="font-medium text-red-600">-$1,399.00</p>
                            <span class="status-badge status-success">Success</span>
                        </div>
                    </div>
                    <div class="flex justify-between text-sm text-gray-500 mb-2">
                        <span>06 Apr 2025 • 6:45 pm</span>
                        <span>512GB • eSIM</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Main Wallet • USD</span>
                        <button class="text-gray-400 hover:text-gray-600">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Transaction Card 3 -->
                <div class="bg-white rounded-xl border border-gray-200 p-4 transaction-row hover:bg-gray-50 cursor-pointer">
                    <div class="flex justify-between mb-2">
                        <div class="flex items-center">
                            <div class="type-icon type-sent mr-2">
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </div>
                            <span class="font-medium">MacBook Air M3 (13")</span>
                        </div>
                        <div class="text-right">
                            <p class="font-medium text-red-600">-$1,299.00</p>
                            <span class="status-badge status-success">Success</span>
                        </div>
                    </div>
                    <div class="flex justify-between text-sm text-gray-500 mb-2">
                        <span>10 Apr 2025 • 11:30 am</span>
                        <span>M3 chip • Ultra-light</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Main Wallet • USD</span>
                        <button class="text-gray-400 hover:text-gray-600">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Load More Button -->
        <div class="mt-6 text-center">
            <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Load more transactions
            </button>
        </div>
    </main>

    <!-- Footer -->
    <footer class="w-full py-6 px-6 border-t border-gray-200 text-center text-sm text-gray-500 mt-8">
        <p>© 2023 XUPAY. All rights reserved.</p>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Add hover effect for desktop
            const transactionRows = document.querySelectorAll('.transaction-row');
            transactionRows.forEach(row => {
                row.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                });
                
                row.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                });
            });
            
            // Filter functionality
            const filterButtons = document.querySelectorAll('.filter-button');
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => {
                        btn.classList.remove('bg-blue-50', 'text-blue-700');
                        btn.classList.add('bg-gray-100', 'text-gray-700');
                    });
                    this.classList.remove('bg-gray-100', 'text-gray-700');
                    this.classList.add('bg-blue-50', 'text-blue-700');
                });
            });
            
            // Detail view (simplified for demo)
            const detailButtons = document.querySelectorAll('.transaction-row');
            detailButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // In a real app, this would open a side panel or modal
                    alert('Opening transaction details for: ' + 
                          this.querySelector('.font-medium').textContent);
                });
            });
        });
    </script>
</body>
</html>


import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, Copy, AlertCircle, ChevronDown, ChevronUp, 
  ArrowUpRight, ArrowDownLeft, CreditCard, Banknote, RefreshCcw,
  Clock, CheckCircle, XCircle, HelpCircle
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  time: string;
  description: string;
  merchant?: string;
  type: 'sent' | 'received' | 'fee' | 'refund' | 'topup';
  status: 'completed' | 'pending' | 'failed';
  amount: number;
  currency: string;
  wallet: string;
  counterparty: string;
  fee?: number;
  transactionId: string;
  reference?: string;
  method: string;
  balanceAfter?: number;
}

export default function App() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  const [walletFilter, setWalletFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: 'tx1',
      date: '02 Apr 2025',
      time: '8:15 am',
      description: 'Meta Quest 3',
      merchant: 'Meta Store',
      type: 'sent',
      status: 'completed',
      amount: -499.00,
      currency: 'USD',
      wallet: 'Main Wallet',
      counterparty: 'Meta Inc.',
      fee: 2.50,
      transactionId: 'txn_1234567890',
      reference: 'ORDER#98765',
      method: 'Credit Card',
      balanceAfter: 15423.50
    },
    {
      id: 'tx2',
      date: '06 Apr 2025',
      time: '6:45 pm',
      description: 'iPhone 15 Pro Max',
      merchant: 'Apple Store',
      type: 'sent',
      status: 'completed',
      amount: -1399.00,
      currency: 'USD',
      wallet: 'Main Wallet',
      counterparty: 'Apple Inc.',
      fee: 6.99,
      transactionId: 'txn_0987654321',
      reference: 'ORDER#12345',
      method: 'Debit Card',
      balanceAfter: 13924.51
    },
    {
      id: 'tx3',
      date: '10 Apr 2025',
      time: '11:30 am',
      description: 'MacBook Air M3',
      merchant: 'Best Buy',
      type: 'sent',
      status: 'completed',
      amount: -1299.00,
      currency: 'USD',
      wallet: 'Main Wallet',
      counterparty: 'Best Buy Inc.',
      fee: 6.50,
      transactionId: 'txn_1122334455',
      reference: 'ORDER#54321',
      method: 'Apple Pay',
      balanceAfter: 12525.01
    },
    {
      id: 'tx4',
      date: '14 Apr 2025',
      time: '7:50 pm',
      description: 'AirPods Pro',
      merchant: 'Apple Store',
      type: 'sent',
      status: 'completed',
      amount: -229.00,
      currency: 'USD',
      wallet: 'Main Wallet',
      counterparty: 'Apple Inc.',
      fee: 1.15,
      transactionId: 'txn_5566778899',
      reference: 'ORDER#67890',
      method: 'Credit Card',
      balanceAfter: 12295.86
    },
    {
      id: 'tx5',
      date: '18 Apr 2025',
      time: '9:05 am',
      description: 'Apple Vision Pro',
      merchant: 'Apple Store',
      type: 'sent',
      status: 'completed',
      amount: -3499.00,
      currency: 'USD',
      wallet: 'Main Wallet',
      counterparty: 'Apple Inc.',
      fee: 17.50,
      transactionId: 'txn_9988776655',
      reference: 'ORDER#09876',
      method: 'Wire Transfer',
      balanceAfter: 8796.86
    },
    {
      id: 'tx6',
      date: '21 Apr 2025',
      time: '3:20 pm',
      description: 'Salary Deposit',
      merchant: 'TechCorp Inc.',
      type: 'received',
      status: 'completed',
      amount: 8500.00,
      currency: 'USD',
      wallet: 'Main Wallet',
      counterparty: 'TechCorp Inc.',
      fee: 0,
      transactionId: 'txn_1357924680',
      reference: 'PAYROLL-APR25',
      method: 'ACH Transfer',
      balanceAfter: 17296.86
    },
    {
      id: 'tx7',
      date: '25 Apr 2025',
      time: '10:15 am',
      description: 'Subscription Fee',
      merchant: 'Netflix',
      type: 'fee',
      status: 'completed',
      amount: -15.99,
      currency: 'USD',
      wallet: 'Main Wallet',
      counterparty: 'Netflix Inc.',
      fee: 0,
      transactionId: 'txn_2468013579',
      reference: 'BILL-NETFLIX-2025',
      method: 'Auto Debit',
      balanceAfter: 17280.87
    },
    {
      id: 'tx8',
      date: '28 Apr 2025',
      time: '1:30 pm',
      description: 'Refund - Headphones',
      merchant: 'Amazon',
      type: 'refund',
      status: 'completed',
      amount: 89.99,
      currency: 'USD',
      wallet: 'Main Wallet',
      counterparty: 'Amazon.com',
      fee: 0,
      transactionId: 'txn_9753108642',
      reference: 'REFUND-AMZ-7890',
      method: 'Credit Card',
      balanceAfter: 17370.86
    }
  ];

  // Filter transactions based on criteria
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.transactionId.includes(searchQuery);
    
    const matchesWallet = walletFilter === 'all' || tx.wallet === walletFilter;
    const matchesType = typeFilter === 'all' || 
                        (typeFilter === 'sent' && tx.amount < 0) || 
                        (typeFilter === 'received' && tx.amount > 0) ||
                        tx.type === typeFilter;
    
    return matchesSearch && matchesWallet && matchesType;
  });

  // Summary data
  const summary = {
    totalSent: filteredTransactions
      .filter(tx => tx.amount < 0 && tx.status === 'completed')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0),
    totalReceived: filteredTransactions
      .filter(tx => tx.amount > 0 && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0),
    netFlow: filteredTransactions
      .filter(tx => tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0),
    transactionCount: filteredTransactions.length,
    failedCount: filteredTransactions.filter(tx => tx.status === 'failed').length
  };

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setIsDrawerOpen(false);
        setSelectedTransaction(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle transaction row click
  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDrawerOpen(true);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Generate status badge components
  const getStatusBadge = (status: string) => {
    const statusMap = {
      completed: { 
        label: 'Completed', 
        className: 'bg-green-500/10 text-green-400 border-green-500/20',
        icon: <CheckCircle className="w-3 h-3" />
      },
      pending: { 
        label: 'Pending', 
        className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        icon: <Clock className="w-3 h-3" />
      },
      failed: { 
        label: 'Failed', 
        className: 'bg-red-500/10 text-red-400 border-red-500/20',
        icon: <XCircle className="w-3 h-3" />
      }
    };
    
    const statusData = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return (
      <div className={`flex items-center px-2 py-1 rounded-full border ${statusData.className}`}>
        {statusData.icon}
        <span className="ml-1 text-xs font-medium">{statusData.label}</span>
      </div>
    );
  };

  // Get type icon and color
  const getTypeIcon = (type: string, size = 16) => {
    const typeMap = {
      sent: { 
        icon: <ArrowUpRight size={size} />, 
        className: 'bg-red-500/10 text-red-400' 
      },
      received: { 
        icon: <ArrowDownLeft size={size} />, 
        className: 'bg-green-500/10 text-green-400' 
      },
      fee: { 
        icon: <CreditCard size={size} />, 
        className: 'bg-blue-500/10 text-blue-400' 
      },
      refund: { 
        icon: <RefreshCcw size={size} />, 
        className: 'bg-purple-500/10 text-purple-400' 
      },
      topup: { 
        icon: <Banknote size={size} />, 
        className: 'bg-yellow-500/10 text-yellow-400' 
      }
    };
    
    const typeData = typeMap[type as keyof typeof typeMap] || typeMap.sent;
    return (
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${typeData.className}`}>
        {typeData.icon}
      </div>
    );
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-50 border-b ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-3"></div>
            <h1 className="text-xl font-bold">XUPAY</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">Transactions</h2>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                All activity across your wallets
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
              <div className="relative mb-3 sm:mb-0">
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className={`block appearance-none w-full bg-transparent border rounded-lg py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isDarkMode ? 'border-gray-700 text-gray-100' : 'border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="today">Today</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d" selected>Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="custom">Custom range</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <ChevronDown className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`} />
                </div>
              </div>
              
              <div className="relative">
                <select 
                  value={walletFilter}
                  onChange={(e) => setWalletFilter(e.target.value)}
                  className={`block appearance-none w-full sm:w-48 bg-transparent border rounded-lg py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isDarkMode ? 'border-gray-700 text-gray-100' : 'border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">All wallets</option>
                  <option value="main">Main Wallet</option>
                  <option value="secondary">Secondary Wallet</option>
                  <option value="crypto">Crypto Wallet</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <ChevronDown className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex space-x-2 mb-4 sm:mb-0 overflow-x-auto pb-2">
              {['all', 'sent', 'received', 'failed', 'fee', 'refund', 'topup'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTypeFilter(filter)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    typeFilter === filter
                      ? 'bg-blue-500/20 text-blue-400'
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
              <input
                type="text"
                placeholder="Search by name, amount, reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Sent', value: formatCurrency(summary.totalSent, 'USD'), trend: '-12.5%', isNegative: true },
            { label: 'Total Received', value: formatCurrency(summary.totalReceived, 'USD'), trend: '+8.2%', isNegative: false },
            { label: 'Net Flow', value: formatCurrency(summary.netFlow, 'USD'), trend: '+25.7%', isNegative: false },
            { label: 'Transactions', value: `${summary.transactionCount} (${summary.failedCount} failed)`, icon: <HelpCircle size={16} /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`rounded-xl p-4 ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">{stat.value}</p>
                {stat.icon && <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.icon}</span>}
              </div>
              {stat.trend && (
                <div className={`flex items-center mt-1 text-xs ${
                  stat.isNegative ? 'text-red-500' : 'text-green-500'
                }`}>
                  {stat.isNegative ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  <span>{stat.trend}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Transaction Table - Desktop */}
        <div className="hidden md:block">
          <div className={`rounded-xl overflow-hidden border ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className={`hidden md:grid grid-cols-12 gap-4 px-6 py-3 font-medium text-sm sticky top-0 z-10 ${
              isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-gray-50 border-b border-gray-200'
            }`}>
              <div className="col-span-2">Date & Time</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-2">Wallet / Currency</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1"></div>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredTransactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`md:grid md:grid-cols-12 md:gap-4 px-4 md:px-6 py-4 hover:bg-opacity-5 cursor-pointer transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleTransactionClick(tx)}
                >
                  <div className="col-span-2 mb-2 md:mb-0">
                    <p className="font-medium">{tx.date}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tx.time}</p>
                  </div>
                  
                  <div className="col-span-3 mb-2 md:mb-0">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                        tx.type === 'received' ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}>
                        <span className={`font-medium text-lg ${
                          tx.type === 'received' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {tx.merchant?.charAt(0) || tx.counterparty.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{tx.description}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {tx.counterparty}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 mb-2 md:mb-0 flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isDarkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-800'
                    }`}>
                      {tx.wallet} • {tx.currency}
                    </span>
                  </div>
                  
                  <div className="col-span-1 mb-2 md:mb-0 flex items-center justify-center">
                    {getTypeIcon(tx.type)}
                  </div>
                  
                  <div className="col-span-2 mb-2 md:mb-0 text-right">
                    <p className={`font-medium ${
                      tx.amount > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {formatCurrency(Math.abs(tx.amount), tx.currency)}
                    </p>
                    {tx.fee && tx.fee > 0 && (
                      <p className={`text-xs mt-0.5 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        +{formatCurrency(tx.fee, tx.currency)} fee
                      </p>
                    )}
                  </div>
                  
                  <div className="col-span-1 mb-2 md:mb-0 flex items-center justify-center">
                    {getStatusBadge(tx.status)}
                  </div>
                  
                  <div className="col-span-1 flex items-center justify-end">
                    <button 
                      className={`p-2 rounded-full transition-colors ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle action menu
                      }}
                    >
                      <ChevronDown size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Transaction Cards - Mobile */}
        <div className="md:hidden space-y-3">
          {filteredTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`rounded-xl p-4 ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
              onClick={() => handleTransactionClick(tx)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  {getTypeIcon(tx.type, 20)}
                  <div className="ml-2">
                    <p className="font-medium">{tx.description}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {tx.counterparty}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium text-lg ${
                    tx.amount > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {tx.amount > 0 ? '+' : '-'}{formatCurrency(Math.abs(tx.amount), tx.currency)}
                  </p>
                  {getStatusBadge(tx.status)}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {tx.date} • {tx.time}
                  </p>
                  <span className={`mt-1 px-2 py-1 rounded-full text-xs ${
                    isDarkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-800'
                  }`}>
                    {tx.wallet}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-300">
                  <ChevronDown size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Load More Button */}
        <div className="mt-8 text-center">
          <button 
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Load more transactions
          </button>
        </div>
      </main>
      
      {/* Transaction Detail Drawer */}
      <AnimatePresence>
        {isDrawerOpen && selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
          >
            <motion.div
              ref={drawerRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "tween", duration: 0.3 }}
              className={`fixed right-0 top-0 h-full w-full max-w-md overflow-y-auto ${
                isDarkMode ? 'bg-gray-900 border-l border-gray-800' : 'bg-white border-l border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold">Transaction Details</h3>
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedTransaction.date} • {selectedTransaction.time}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <XCircle size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                  </button>
                </div>
                
                {/* Status Header */}
                <div className="mb-6 p-4 rounded-xl border border-dashed flex flex-col items-center justify-center">
                  <div className="flex items-center mb-3">
                    {getTypeIcon(selectedTransaction.type, 24)}
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                  <p className={`text-3xl font-bold ${
                    selectedTransaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {selectedTransaction.amount > 0 ? '+' : '-'}{formatCurrency(Math.abs(selectedTransaction.amount), selectedTransaction.currency)}
                  </p>
                  <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedTransaction.description}
                  </p>
                </div>
                
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>From</p>
                    <div className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      <p className="font-medium">{selectedTransaction.wallet}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedTransaction.method}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>To</p>
                    <div className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      <p className="font-medium">{selectedTransaction.counterparty}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedTransaction.merchant || 'External Account'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Transaction Details */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 flex items-center">
                    <AlertCircle className="mr-2" size={18} />
                    Transaction Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Transaction ID</span>
                      <span className="font-mono text-sm">{selectedTransaction.transactionId}</span>
                    </div>
                    {selectedTransaction.reference && (
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Reference</span>
                        <span className="font-mono text-sm">{selectedTransaction.reference}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Method</span>
                      <span>{selectedTransaction.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Status</span>
                      <span className="font-medium">{selectedTransaction.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Amount</span>
                      <span className={`font-medium ${
                        selectedTransaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                      </span>
                    </div>
                    {selectedTransaction.fee && selectedTransaction.fee > 0 && (
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Fee</span>
                        <span className="text-red-500">-{formatCurrency(selectedTransaction.fee, selectedTransaction.currency)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Balance After</span>
                      <span>{formatCurrency(selectedTransaction.balanceAfter || 0, selectedTransaction.currency)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => copyToClipboard(selectedTransaction.transactionId)}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
                      isDarkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Copy className="mr-2" size={18} />
                    Copy Transaction ID
                  </button>
                  
                  <button
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
                      isDarkMode
                        ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <Download className="mr-2" size={18} />
                    Download Receipt
                  </button>
                  
                  <button
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
                      isDarkMode
                        ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    <AlertCircle className="mr-2" size={18} />
                    Report Issue
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <footer className={`py-6 px-4 border-t ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>© {new Date().getFullYear()} XUPAY. All rights reserved.</p>
          <p className={`mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            This is a demo interface. In production, all data would be encrypted and secure.
          </p>
        </div>
      </footer>
    </div>
  );
}

landing and welcome, 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web3 Career Platform</title>
    <style>
        /* Core styles for the layout */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', Arial, sans-serif;
        }

        :root {
            --primary: #ff00a0;
            --secondary: #b300ff;
            --dark: #0a0a0a;
            --text: #ffffff;
            --grid-color: rgba(255, 255, 255, 0.2);
        }

        body {
            background-color: var(--dark);
            color: var(--text);
            overflow-x: hidden;
            background-image: linear-gradient(to bottom, #000000 0%, #1a0020 100%);
            background-attachment: fixed;
        }

        /* Navigation styles */
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 5%;
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(10, 10, 10, 0.9);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .navbar-logo {
            font-weight: 700;
            font-size: 1.5rem;
            color: var(--primary);
            text-shadow: 0 2px 10px rgba(255, 0, 160, 0.3);
        }

        .navbar-links {
            display: flex;
            gap: 1.5rem;
            list-style: none;
        }

        .navbar-links a {
            color: var(--text);
            text-decoration: none;
            position: relative;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .navbar-links a:hover {
            color: var(--primary);
        }

        .navbar-links a::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -5px;
            left: 0;
            background: var(--primary);
            transition: width 0.3s ease;
        }

        .navbar-links a:hover::after {
            width: 100%;
        }

        .navbar-buttons {
            display: flex;
            gap: 1rem;
        }

        .btn {
            padding: 0.5rem 1.2rem;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid transparent;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            box-shadow: 0 4px 15px rgba(255, 0, 160, 0.3);
        }

        .btn-outline {
            color: var(--primary);
            border-color: var(--primary);
            background: transparent;
        }

        /* Hero section styles */
        .hero {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 2rem 5%;
            text-align: center;
            overflow: hidden;
        }

        /* 3D Wave Effect - Core of the design */
        .wave-container {
            width: 100%;
            height: 500px;
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
            perspective: 1000px;
            /* This is where the 3D effect is created */
            /* Note: In a real implementation, this would be a 3D canvas or WebGL element */
        }

        /* Grid wave pattern - this is the pink grid that forms the wave */
        .wave-grid {
            width: 100%;
            height: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            background: 
                linear-gradient(90deg, var(--grid-color) 1px, transparent 1px),
                linear-gradient(var(--grid-color) 1px, transparent 1px);
            background-size: 20px 20px;
            transform: rotateX(60deg) translateZ(-100px);
            /* This transform creates the 3D perspective effect */
        }

        /* The sphere that floats above the wave */
        .floating-sphere {
            position: absolute;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #ff00a0, #b300ff);
            box-shadow: 0 0 50px rgba(255, 0, 160, 0.5), 
                        0 0 100px rgba(179, 0, 255, 0.3);
            top: -60px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 3;
            /* 3D effect - the sphere appears to float above the wave */
            animation: float 6s ease-in-out infinite;
        }

        /* Company logos arranged in a circular pattern around the wave */
        .company-logos {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            transform-style: preserve-3d;
            transform: rotateX(60deg) translateZ(-100px);
        }

        .company-logo {
            position: absolute;
            transform: translateZ(200px);
            transition: all 0.5s ease;
            opacity: 0.8;
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }

        /* Keyframes for 3D effects */
        @keyframes float {
            0%, 100% {
                transform: translateX(-50%) translateY(0);
            }
            50% {
                transform: translateX(-50%) translateY(-20px);
            }
        }

        /* Text elements */
        .hero h1 {
            font-size: 5rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 20px;
            margin-bottom: 1rem;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            animation: textGlow 3s infinite alternate;
        }

        @keyframes textGlow {
            0% {
                text-shadow: 0 0 10px rgba(255, 0, 160, 0.3);
            }
            100% {
                text-shadow: 0 0 30px rgba(179, 0, 255, 0.5);
            }
        }

        .hero p {
            font-size: 1.2rem;
            max-width: 800px;
            margin: 1rem auto;
            line-height: 1.6;
            opacity: 0.9;
        }

        .hero a {
            color: var(--primary);
            text-decoration: underline;
            font-weight: 600;
        }

        /* Email subscription section */
        .subscribe-container {
            display: flex;
            justify-content: center;
            margin: 2rem 0;
            z-index: 2;
            position: relative;
        }

        .subscribe-form {
            display: flex;
            max-width: 500px;
            width: 100%;
        }

        .subscribe-input {
            flex: 1;
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 4px 0 0 4px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1rem;
            outline: none;
        }

        .subscribe-btn {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 0 4px 4px 0;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .subscribe-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(255, 0, 160, 0.3);
        }

        /* Report section */
        .report-section {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 1.5rem;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 2rem;
            position: relative;
            z-index: 2;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .report-content h3 {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
        }

        .report-btn {
            background: white;
            color: var(--primary);
            border: 2px solid white;
            padding: 0.5rem 1.5rem;
            border-radius: 4px;
            font-weight: 600;
            transition: all 0.3s;
        }

        .report-btn:hover {
            background: transparent;
            color: white;
            transform: translateY(-3px);
        }

        /* 3D Effect Comments */
        /* 
        3D Effect Implementation Notes:
        
        1. The wave effect is created using CSS 3D transforms:
           - The .wave-grid element uses transform: rotateX(60deg) to create the perspective
           - This makes the grid appear as a 3D plane receding into the distance
        
        2. The floating sphere:
           - Uses keyframe animation to create a gentle floating motion
           - Has multiple box-shadows for the glowing effect
           - Positioned absolutely above the wave
        
        3. Company logos:
           - Arranged in a circular pattern using JavaScript in the real implementation
           - Each logo has a transform: translateZ() value to position it in 3D space
           - The container has transform-style: preserve-3d to maintain 3D positioning
        
        4. The entire 3D scene:
           - Is built with a combination of CSS transforms and JavaScript
           - In a production environment, this would likely use Three.js or similar 3D library
           - The current implementation shows the CSS structure that would be enhanced with 3D libraries
        
        5. Performance considerations:
           - The CSS 3D transforms are GPU-accelerated
           - The animation is designed to be smooth on modern devices
           - For complex 3D scenes, a dedicated 3D library would be more efficient
        
        6. Artistic elements:
           - The pink/purple gradient creates a futuristic, tech-forward aesthetic
           - The grid pattern on the wave gives a digital, techy feel
           - The glowing effects add depth and visual interest
        */
    </style>
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="navbar-logo">Web3</div>
        <ul class="navbar-links">
            <li><a href="#">Web3 Jobs</a></li>
            <li><a href="#">Salaries</a></li>
            <li><a href="#">Internships</a></li>
            <li><a href="#">Learn Web3</a></li>
            <li><a href="#">TOP Web3 Jobs</a></li>
        </ul>
        <div class="navbar-buttons">
            <button class="btn btn-outline">Login</button>
            <button class="btn btn-primary">Post a Job</button>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <h1>WEB3 IS THE FUTURE</h1>
        <p>Browse 69,700 blockchain jobs in web3 at 7,427 projects. Filter the best remote crypto jobs by salary, location, and skills.</p>
        <p>web3.career is now part of the <strong>Bondex Ecosystem</strong></p>
        
        <!-- Email Subscription -->
        <div class="subscribe-container">
            <form class="subscribe-form">
                <input type="email" class="subscribe-input" placeholder="Type your email">
                <button type="submit" class="subscribe-btn">Subscribe</button>
            </form>
        </div>

        <!-- 3D Wave Container - This is the key visual element -->
        <div class="wave-container">
            <!-- Grid wave pattern -->
            <div class="wave-grid"></div>
            
            <!-- Floating sphere in the center -->
            <div class="floating-sphere"></div>
            
            <!-- Company logos arranged in a circular pattern -->
            <div class="company-logos">
                <div class="company-logo" style="left: 15%; top: 40%; transform: translateZ(200px) rotateY(0deg) translateX(150px);">techstars</div>
                <div class="company-logo" style="left: 25%; top: 35%; transform: translateZ(200px) rotateY(30deg) translateX(150px);">uniswap</div>
                <div class="company-logo" style="left: 35%; top: 30%; transform: translateZ(200px) rotateY(60deg) translateX(150px);">unicef</div>
                <div class="company-logo" style="left: 65%; top: 30%; transform: translateZ(200px) rotateY(120deg) translateX(150px);">polygon</div>
                <div class="company-logo" style="left: 75%; top: 35%; transform: translateZ(200px) rotateY(150deg) translateX(150px);">aave</div>
                <div class="company-logo" style="left: 85%; top: 40%; transform: translateZ(200px) rotateY(180deg) translateX(150px);">binance</div>
            </div>
        </div>

        <!-- Report Section -->
        <div class="report-section">
            <div class="report-content">
                <h3>Web3 Career Intelligence Report 2025</h3>
                <p>Get the Inside Track to Your Next Career Move</p>
            </div>
            <button class="report-btn">View report</button>
        </div>
    </section>

    <!-- 3D Effect Implementation Notes -->
    <script>
        /*
        3D Effect Implementation Notes:
        
        1. For the actual 3D wave effect, you would typically use:
           - Three.js or similar 3D library
           - A combination of JavaScript and WebGL for smooth performance
        
        2. Key elements to implement:
           a) The wave grid:
              - Create a 3D plane with a grid texture
              - Animate the vertices to create a wave effect
              - Use shaders for the pink color and glow effects
        
           b) The floating sphere:
              - Create a 3D sphere with a gradient material
              - Add multiple point lights for the glow effect
              - Animate the sphere's position for the floating motion
        
           c) Company logos:
              - Position logos in a circular pattern around the wave
              - Use 3D transforms to create depth
              - Add subtle rotation animations for visual interest
        
        3. Performance Optimization:
           - Use requestAnimationFrame for smooth animations
           - Implement frustum culling to avoid rendering off-screen elements
           - Use simplified geometry for distant objects
        
        4. Artistic Elements:
           - Use custom shaders for the pink/purple gradient effects
           - Add subtle particle effects around the wave for visual interest
           - Implement dynamic lighting that responds to user interaction
        
        5. Alternative Implementation:
           - For a pure CSS approach (as shown in this example), the 3D effect is limited
           - For full 3D capabilities, a JavaScript 3D library is recommended
           - The current implementation shows the structure that would be enhanced with 3D libraries
        */
        
        // In a real implementation, this would contain 3D animation code
        // using Three.js or similar library to create the dynamic 3D wave effect
        // This is a placeholder for the actual 3D implementation
        document.addEventListener('DOMContentLoaded', function() {
            console.log('3D wave effect would be initialized here with Three.js or similar library');
            
            // Example of how 3D animation might be structured:
            /*
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            
            // Set up the wave geometry, materials, and animation
            // Add lighting for the glowing effects
            // Implement the floating sphere with realistic reflections
            
            function animate() {
                requestAnimationFrame(animate);
                // Update wave animation
                // Rotate company logos
                // Animate floating sphere
                renderer.render(scene, camera);
            }
            animate();
            */
        });
    </script>
</body>
</html>

some idea and try to use effect to modern and user friendly. 