'use client';
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import styles from './Stickers.module.css';

function Stickers() {
  const scene = useRef(null);
  const engine = useRef(Matter.Engine.create());
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const mouseConstraint = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (scene.current) {
      setDimensions({
        width: scene.current.clientWidth,
        height: scene.current.clientHeight,
      });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (scene.current) {
        setDimensions({
          width: scene.current.clientWidth,
          height: scene.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!scene.current) return;

    // Create an engine
    const engineInstance = Matter.Engine.create();
    engine.current = engineInstance;

    // Create a renderer
    const render = Matter.Render.create({
      element: scene.current,
      engine: engineInstance,
      options: {
        width: dimensions.width,
        height: dimensions.height,
        wireframes: false,
        background: 'transparent',
      },
    });

    renderRef.current = render;

    // Create runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    // Define the offset factor relative to the canvas size
    const offsetFactor = Math.min(dimensions.width, dimensions.height) / 5;
    // Create ground and walls positioned just outside the scene with scaled offsets
    const ground = Matter.Bodies.rectangle(dimensions.width / 2, dimensions.height, dimensions.width + 2 * offsetFactor, 60, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
      },
    });
    const leftWall = Matter.Bodies.rectangle(-offsetFactor, dimensions.height / 2 - (offsetFactor + 800) / 2, 60, dimensions.height + offsetFactor + 800, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
      },
    });
    const rightWall = Matter.Bodies.rectangle(dimensions.width + offsetFactor, dimensions.height / 2 - (offsetFactor + 800) / 2, 60, dimensions.height + offsetFactor + 800, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
      },
    });
    const ceiling = Matter.Bodies.rectangle(dimensions.width / 2, -offsetFactor - 800, dimensions.width, 60, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
      },
    });

    const svgData = [
      { x: 0.1, y: -0.4, width: 0.15, height: 0.15, texture: '/stickers/04.svg', angle: Math.PI / 2 },
      { x: 0.4, y: -0.1, width: 0.15, height: 0.2, texture: '/stickers/09.svg', angle: 0 },
      { x: 0.1, y: -0.26, width: 0.15, height: 0.15, texture: '/stickers/11.svg', angle: 0 },
      { x: 0.5, y: -0.1, width: 0.15, height: 0.35, texture: '/stickers/12.svg', angle: 0 },
      { x: 0.65, y: -0.4, width: 0.15, height: 0.3, texture: '/stickers/19.svg', angle: 0 },
      { x: 0.6, y: -0.2, width: 0.15, height: 0.15, texture: '/stickers/14.svg', angle: 0 },
      { x: -0.01, y: -0.3, width: 0.12, height: 0.12, texture: '/stickers/15.svg', angle: 0 },
      { x: 0.95, y: -0.3, width: 0.2, height: 0.2, texture: '/stickers/15.svg', angle: 0 },
      { x: 0.3, y: -0.35, width: 0.1, height: 0.15, texture: '/stickers/17.svg', angle: 0 },
      { x: 0.85, y: -0.4, width: 0.15, height: 0.2, texture: '/stickers/18.svg', angle: 0 },
      { x: 0.91, y: -0.6, width: 0.15, height: 0.35, texture: '/stickers/19.svg', angle: 0 },
      { x: 0.14, y: -0.4, width: 0.15, height: 0.25, texture: '/stickers/20.svg', angle: 0 },
      { x: 0.25, y: -0.4, width: 0.15, height: 0.2, texture: '/stickers/19.svg', angle: 0 },
      { x: 0.35, y: -0.5, width: 0.15, height: 0.35, texture: '/stickers/06.svg', angle: 0 },
      { x: 0.4, y: -0.4, width: 0.15, height: 0.15, texture: '/stickers/05.svg', angle: 0 },
      { x: 0.05, y: -0.4, width: 0.25, height: 0.25, texture: '/stickers/17.svg', angle: 0 },
      { x: 0.1, y: -0.5, width: 0.15, height: 0.45, texture: '/stickers/09.svg', angle: 0 },
      { x: 0.6, y: -0.4, width: 0.2, height: 0.2, texture: '/stickers/06.svg', angle: Math.PI / 2 },
      { x: 0.75, y: -0.4, width: 0.1, height: 0.1, texture: '/stickers/05.svg', angle: 0 },
      { x: 0.9, y: -0.1, width: 0.3, height: 0.15, texture: '/stickers/07.svg', angle: Math.PI / 3 },
      { x: 0.5, y: -0.51, width: 0.1, height: 0.55, texture: '/stickers/01.svg', angle: 0 },
      { x: 0.1, y: -0.6, width: 0.2, height: 0.6, texture: '/stickers/03.svg', angle: Math.PI / 6 },
      { x: 0.7, y: -0.6, width: 0.2, height: 0.65, texture: '/stickers/02.svg', angle: Math.PI / 8 },
      { x: 0.2, y: -0.3, width: 0.3, height: 0.4, texture: '/stickers/07.svg', angle: 0 },
    ];

    // Define the scale factor for the SVGs relative to the canvas size
    const scaleFactor = Math.min(dimensions.width, dimensions.height) / 1000;

    // Create SVG bodies with actual dimensions and adjusted scaling
    const svgBodies = svgData.map(({ x, y, width, height, texture, angle }) =>
      Matter.Bodies.rectangle(
        x * dimensions.width,
        y * dimensions.height,
        width * dimensions.width * scaleFactor,
        height * dimensions.height * scaleFactor,
        {
          angle: angle,
          render: { sprite: { texture, xScale: scaleFactor, yScale: scaleFactor } },
          collisionFilter: { group: -1 }
        }
      )
    );

    // Add all bodies to the world
    Matter.World.add(engineInstance.world, [ground, leftWall, rightWall, ceiling, ...svgBodies]);

    // Add mouse control
    const mouse = Matter.Mouse.create(render.canvas);
    mouseConstraint.current = Matter.MouseConstraint.create(engineInstance, {
      mouse: mouse,
      constraint: {
        render: { visible: false },
      },
    });

    Matter.World.add(engineInstance.world, mouseConstraint.current);

    // Run the renderer and engine
    Matter.Render.run(render);
    Matter.Runner.run(runner, engineInstance);

    return () => {
      // Clean up the Matter.js world
      Matter.World.remove(engineInstance.world, mouseConstraint.current);
      Matter.Engine.clear(engineInstance);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, [dimensions]);

  return <div ref={scene} className={styles.scene} />;
}

export default Stickers;