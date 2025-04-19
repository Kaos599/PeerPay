import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, List, Spin, Alert, Tag, Typography, Tooltip, Skeleton } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const backendUrl = 'http://localhost:3001'; // Adjust if necessary
const { Title, Text, Paragraph } = Typography;

// Helper function to create a single block item for the List
function BlockItem({ block, isValid }) {
    const formattedTimestamp = typeof moment !== 'undefined' 
        ? moment(block.timestamp).format('YYYY-MM-DD HH:mm:ss') 
        : new Date(block.timestamp).toISOString();

    let dataContent = '';
    if (block.index === 0) {
        dataContent = <Text type="secondary">Data: {block.data}</Text>;
    } else if (block.data && typeof block.data === 'object') {
        dataContent = (
            <>
                <Text type="secondary">Sender: {block.data.sender || 'N/A'}</Text><br />
                <Text type="secondary">Recipient: {block.data.recipient || 'N/A'}</Text><br />
                <Text type="secondary">Amount: {block.data.amount !== undefined ? block.data.amount : 'N/A'}</Text>
            </>
        );
    } else {
         dataContent = <Text type="secondary">Data: {JSON.stringify(block.data)}</Text>;
    }

    const validityTag = isValid === false
        ? <Tag icon={<Tooltip title="Previous hash mismatch or preceding block invalid"><span /></Tooltip>} color="error">Invalid</Tag>
        : <Tag color="success">Valid</Tag>;

    // Use Tooltip for full hash on hover
    const renderHash = (hash) => (
        <Tooltip title={hash}>
            <Text code copyable={{ text: hash }} style={{ maxWidth: '100%' }}>
                 {hash.substring(0, 10)}...
            </Text>
        </Tooltip>
    );

    return (
        <Card size="small" style={{ marginBottom: '16px' }}
              title={<Title level={5} style={{ margin: 0 }}>Block #{block.index}</Title>}
              extra={validityTag}
        >
            <Paragraph type="secondary" style={{ fontSize: '0.8em', marginBottom: '8px' }}>Timestamp: {formattedTimestamp}</Paragraph>
            <Card type="inner" size="small" title="Transaction Data" style={{ marginBottom: '8px', background: '#fafafa' }}>
                 {dataContent}
            </Card>
            <div style={{ fontSize: '0.8em', fontFamily: 'monospace', lineHeight: '1.6' }}>
                 <div><Text strong>Hash:</Text> {renderHash(block.hash)}</div>
                 <div><Text strong>Prev Hash:</Text> {block.previousHash === '0' ? '0' : renderHash(block.previousHash)}</div>
            </div>
        </Card>
    );
}

function BlockchainDisplay() {
    const [blocks, setBlocks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBlocks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        // Keep a small delay for visual feedback of loading state
        await new Promise(resolve => setTimeout(resolve, 300)); 
        try {
            const response = await fetch(`${backendUrl}/blocks`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText || 'Failed to fetch'}`);
            }
            const fetchedBlocks = await response.json();

            let previousBlockHash = '0';
            let chainIsValid = true; // Track overall chain validity from the start
            const validatedBlocks = fetchedBlocks.map((block) => {
                let currentBlockValid = true;
                if (block.previousHash !== previousBlockHash) {
                    currentBlockValid = false;
                    chainIsValid = false; // If one link is broken, the rest is considered invalid contextually
                }
                previousBlockHash = block.hash;
                // Assign validity based on its own link AND the status of the chain up to this point
                return { ...block, displayValid: currentBlockValid && chainIsValid }; 
            });

            setBlocks(validatedBlocks);
        } catch (e) {
            console.error('Error fetching blocks:', e);
            setError(e.message);
            setBlocks([]); // Clear blocks on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks]);

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <Title level={4} style={{ margin: 0 }}>Current Blockchain</Title>
                <Button
                    icon={<ReloadOutlined />} 
                    onClick={fetchBlocks}
                    loading={isLoading}
                    disabled={isLoading}
                    type="primary"
                    ghost // Make refresh button less prominent
                >
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>

            {error && <Alert message={`Failed to load blockchain: ${error}`} type="error" showIcon closable style={{ marginBottom: 16 }} />}
            
            {/* Use Ant Design List for better loading/empty states and potential item animation */} 
            <div style={{ maxHeight: '600px', overflowY: 'auto', padding: '0 10px' }}> 
                 <List
                     grid={{ gutter: 16, column: 1 }} // Ensure list items are stacked vertically
                     dataSource={isLoading ? Array(3).fill({}) : blocks} // Show skeleton items or real blocks
                     loading={isLoading}
                     renderItem={(item, index) => isLoading ? (
                         <List.Item>
                             <Skeleton active avatar={{ size: 'small' }} title paragraph={{ rows: 3 }} />
                         </List.Item>
                     ) : (
                         <List.Item>
                             <BlockItem 
                                 key={item.hash || item.index} 
                                 block={item} 
                                 isValid={item.displayValid} 
                             />
                         </List.Item>
                     )}
                 />
                 {!isLoading && !error && blocks.length === 0 && 
                     <Alert message="No blocks in the chain yet." type="info" showIcon />
                 }
            </div>
        </Card>
    );
}

export default BlockchainDisplay; 