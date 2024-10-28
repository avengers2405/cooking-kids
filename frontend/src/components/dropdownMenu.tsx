"use client"

import { DownOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { useState, useEffect } from 'react';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Button, Input } from 'antd';

const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Leetcode',
      // disabled: true,
      extra: '⊞L / ⌘L'
    },
    // {
    //   type: 'divider',
    // },
    {
      key: '2',
      label: 'Codeforces',
      extra: '⊞C / ⌘P',
    },
    {
      key: '3',
      label: 'CSES',
      extra: '⊞E / ⌘E',
    },
    {
      key: '4',
      label: 'Request additional websites...',
      icon: <SettingOutlined />,
      extra: '⌘S',
    },
  ];

interface AppProps {
    displayGraph: (platform: number, username: string | null) => void; // Adjust the type as needed (function type in this case)
}

const App: React.FC<AppProps> = ( {displayGraph} ) => {
  const [platform, setPlatform] = useState(-1);
  const [userInput, setUserInput] = useState<string|null>(null);
  
  const handleUserChange = (e:any) => {
    setUserInput(e.target.value);
  }

  const sendUserInput = (e:any) => {
    displayGraph(platform, userInput);
  }

  // useEffect(()=>{
  //   if (platform == -1){
  //     return;
  //   } else {

  //   }
  // }, [platform])

  const handlePlatformClick = (e: any) => {
    
    switch (e.key) {
        case '1':
            setPlatform(1);
            break;
        case '2':
            setPlatform(2);
            // console.log("set cf to: ", platform);
            // displayGraph(platform, null);
            break;
        case '3':
            setPlatform(3);
            break;
        case '4':
            setPlatform(4);
            break;
        default:
            break;
    }
  };

  return (
    <div>
      <Dropdown menu={{ items, onClick: handlePlatformClick}}>
          <a onClick={(e) => e.preventDefault()}>
          {/* <a> */}
          <Space>
              {/* Choose Platform */}
              { (platform==-1?'Choose Platform':(platform==1?'Leetcode':(platform==2?'Codeforces':(platform==3?'CSES':'Request website to be added')))) }
              <DownOutlined />
          </Space>
          </a>
      </Dropdown>
      {/* {<br/>}{<br/>}{<br/>} */}
      { (platform!=-1) && <div><br/><br/></div> }
      { (platform!=-1) && 
        <div className='flex'>
          <Input size="large" onChange={handleUserChange} placeholder={`Enter ${platform==1?'Leetcode':(platform==2?'Codeforces':(platform==3?'CSES':'Other'))} username`} prefix={<UserOutlined />} />
          <Button className='m-auto ml-1' color="default" variant="filled" onClick={sendUserInput}>
            Go!
          </Button>
        </div>
      }
    </div>
  )
};

export default App;