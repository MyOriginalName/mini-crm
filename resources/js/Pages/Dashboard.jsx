import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import ClientsWidget from '@/Components/ClientsWidget';
import CreateClientWidget from '@/Components/CreateClientWidget';
import { ClientsWidgetProvider } from '@/Components/ClientsWidgetContext';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Dashboard({ auth }) {
    const [layouts, setLayouts] = useState({
        lg: [
            { i: 'clients', x: 0, y: 0, w: 8, h: 4, minW: 4, minH: 3 },
            { i: 'createClient', x: 8, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
        ],
        md: [
            { i: 'clients', x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
            { i: 'createClient', x: 6, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
        ],
        sm: [
            { i: 'clients', x: 0, y: 0, w: 12, h: 4, minW: 4, minH: 3 },
            { i: 'createClient', x: 0, y: 4, w: 12, h: 4, minW: 3, minH: 3 },
        ],
    });

    const handleLayoutChange = (layout, layouts) => {
        setLayouts(layouts);
        localStorage.setItem('dashboard-layouts', JSON.stringify(layouts));
    };

    useEffect(() => {
        const savedLayouts = localStorage.getItem('dashboard-layouts');
        if (savedLayouts) {
            setLayouts(JSON.parse(savedLayouts));
        }
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Дашборд</h2>}
        >
            <Head title="Дашборд" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <ClientsWidgetProvider>
                        <ResponsiveGridLayout
                            className="layout"
                            layouts={layouts}
                            breakpoints={{ lg: 1200, md: 996, sm: 768 }}
                            cols={{ lg: 12, md: 10, sm: 12 }}
                            rowHeight={100}
                            onLayoutChange={handleLayoutChange}
                            isDraggable={true}
                            isResizable={true}
                            margin={[20, 20]}
                            draggableHandle=".drag-handle"
                            useCSSTransforms={true}
                        >
                            <div key="clients" className="widget-container">
                                <ClientsWidget />
                            </div>
                            <div key="createClient" className="widget-container">
                                <CreateClientWidget />
                            </div>
                        </ResponsiveGridLayout>
                    </ClientsWidgetProvider>
                </div>
            </div>

            <style jsx>{`
                .widget-container {
                    background: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
                    overflow: hidden;
                    height: 100%;
                }
                
                .widget-container > div {
                    height: 100%;
                    overflow: auto;
                }

                .react-resizable-handle {
                    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+');
                    background-position: bottom right;
                    background-repeat: no-repeat;
                    background-origin: content-box;
                    box-sizing: border-box;
                    cursor: se-resize;
                    padding: 0 3px 3px 0;
                }

                .react-grid-item.react-grid-placeholder {
                    background: #1e40af;
                    opacity: 0.2;
                    transition-duration: 100ms;
                    z-index: 2;
                    border-radius: 0.5rem;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    -o-user-select: none;
                    user-select: none;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
