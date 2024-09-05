import { useEffect } from "react";

export default function DraggableBackground() {
    useEffect(() => {
        const draggableItems = document.querySelectorAll('.draggable-item');

        draggableItems.forEach(item => {
            // Set a random initial position for each item test
            const randomLeft = Math.random() * (window.innerWidth - item.offsetWidth);
            const randomTop = Math.random() * (window.innerHeight - item.offsetHeight);

            item.style.left = `${randomLeft}px`;
            item.style.top = `${randomTop}px`;

            let shiftX = 0;
            let shiftY = 0;
            const velocityY = 15; // Set a constant vertical speed
            let animationFrameId;

            const moveAt = () => {
                const rect = item.getBoundingClientRect();
                const parent = item.parentElement.getBoundingClientRect();

                // Apply velocity to the position
                item.style.top = rect.top - velocityY + 'px';

                // Check if the item goes out of the bottom boundary
                if (rect.bottom >= parent.bottom) {
                    // Reset position to the top
                    item.style.top = parent.top + 'px';
                }

                animationFrameId = requestAnimationFrame(moveAt);
            };

            const onMouseMove = (event) => {
                item.style.left = event.pageX - shiftX + 'px';
                item.style.top = event.pageY - shiftY + 'px';
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                startFalling(); // Resume falling after dragging
            };

            const startFalling = () => {
                cancelAnimationFrame(animationFrameId); // Stop the previous animation
                animationFrameId = requestAnimationFrame(moveAt);
            };

            item.addEventListener('mousedown', (e) => {
                cancelAnimationFrame(animationFrameId); // Stop falling while dragging

                // Calculate the shift from the mouse click position to the top-left corner of the item
                shiftX = e.clientX - item.getBoundingClientRect().left;
                shiftY = e.clientY - item.getBoundingClientRect().top;

                // Add event listeners for moving the item
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            item.addEventListener('dragstart', () => false);
            startFalling(); // Start the falling effect
        });
    }, []);

    return (
        <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden">
            <div className="draggable-item absolute p-4 bg-blue-500 text-white rounded-lg m-4 font-bold cursor-grab">Audit.ai</div>
            <div className="draggable-item absolute p-4 bg-yellow-400 text-white rounded-lg m-4 font-bold cursor-grab">GNN</div>
            <div className="draggable-item absolute p-4 bg-green-500 text-white rounded-lg m-4 font-bold cursor-grab">Re-entrancy</div>
            <div className="draggable-item absolute p-4 bg-red-500 text-white rounded-lg m-4 font-bold cursor-grab">AI</div>
            <div className="draggable-item absolute p-4 bg-orange-500 text-white rounded-lg m-4 font-bold cursor-grab">60,000 codes</div>
            <div className="draggable-item absolute p-4 bg-purple-500 text-white rounded-lg m-4 font-bold cursor-grab">85% accuracy</div>
            <div className="draggable-item absolute p-4 bg-violet-500 text-white rounded-lg m-4 font-bold cursor-grab">Solidity</div>
        </div>
    );
}
