import { click } from "@testing-library/user-event/dist/click";
import React, { useEffect, useState } from "react";
import Projects from "../Projects/projects";
import "./hero.css";
import "./planets.css";

export default function Hero() {
    let [showProjects, setProjects] = useState(true);

    useEffect(() => {
        const STAR_COLOR = "#fff";
        const STAR_SIZE = 3;
        const STAR_MIN_SCALE = 0.2;
        const OVERFLOW_THRESHOLD = 50;
        const STAR_COUNT = (window.innerWidth + window.innerHeight) / 8;

        const canvas: any = document.querySelector("canvas"),
            context = canvas.getContext("2d");

        let scale = 1, // device pixel ratio
            width,
            height;

        let stars: any[] = [];

        let pointerX, pointerY;

        let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };

        let touchInput = false;

        generate();
        resize();
        step();

        window.onresize = resize;
        canvas.onmousemove = onMouseMove;
        canvas.ontouchmove = onTouchMove;
        canvas.ontouchend = onMouseLeave;
        document.onmouseleave = onMouseLeave;

        function generate() {
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: 0,
                    y: 0,
                    z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
                });
            }
        }

        function placeStar(star) {
            star.x = Math.random() * width;
            star.y = Math.random() * height;
        }

        function recycleStar(star) {
            let direction = "z";

            let vx = Math.abs(velocity.x),
                vy = Math.abs(velocity.y);

            if (vx > 1 || vy > 1) {
                let axis;

                if (vx > vy) {
                    axis = Math.random() < vx / (vx + vy) ? "h" : "v";
                } else {
                    axis = Math.random() < vy / (vx + vy) ? "v" : "h";
                }

                if (axis === "h") {
                    direction = velocity.x > 0 ? "l" : "r";
                } else {
                    direction = velocity.y > 0 ? "t" : "b";
                }
            }

            star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

            if (direction === "z") {
                star.z = 0.1;
                star.x = Math.random() * width;
                star.y = Math.random() * height;
            } else if (direction === "l") {
                star.x = -OVERFLOW_THRESHOLD;
                star.y = height * Math.random();
            } else if (direction === "r") {
                star.x = width + OVERFLOW_THRESHOLD;
                star.y = height * Math.random();
            } else if (direction === "t") {
                star.x = width * Math.random();
                star.y = -OVERFLOW_THRESHOLD;
            } else if (direction === "b") {
                star.x = width * Math.random();
                star.y = height + OVERFLOW_THRESHOLD;
            }
        }

        function resize() {
            scale = window.devicePixelRatio || 1;

            width = window.innerWidth * scale;
            height = window.innerHeight * scale;

            canvas.width = width;
            canvas.height = height;

            stars.forEach(placeStar);
        }

        function step() {
            context.clearRect(0, 0, width, height);

            update();
            render();

            requestAnimationFrame(step);
        }

        function update() {
            velocity.tx *= 0.96;
            velocity.ty *= 0.96;

            velocity.x += (velocity.tx - velocity.x) * 0.8;
            velocity.y += (velocity.ty - velocity.y) * 0.8;

            stars.forEach((star) => {
                star.x += velocity.x * star.z;
                star.y += velocity.y * star.z;

                star.x += (star.x - width / 2) * velocity.z * star.z;
                star.y += (star.y - height / 2) * velocity.z * star.z;
                star.z += velocity.z;

                // recycle when out of bounds
                if (
                    star.x < -OVERFLOW_THRESHOLD ||
                    star.x > width + OVERFLOW_THRESHOLD ||
                    star.y < -OVERFLOW_THRESHOLD ||
                    star.y > height + OVERFLOW_THRESHOLD
                ) {
                    recycleStar(star);
                }
            });
        }

        function render() {
            stars.forEach((star) => {
                context.beginPath();
                context.lineCap = "round";
                context.lineWidth = STAR_SIZE * star.z * scale;
                context.globalAlpha = 0.5 + 0.5 * Math.random();
                context.strokeStyle = STAR_COLOR;

                context.beginPath();
                context.moveTo(star.x, star.y);

                var tailX = velocity.x * 2,
                    tailY = velocity.y * 2;

                // stroke() wont work on an invisible line
                if (Math.abs(tailX) < 0.1) tailX = 0.5;
                if (Math.abs(tailY) < 0.1) tailY = 0.5;

                context.lineTo(star.x + tailX, star.y + tailY);

                context.stroke();
            });
        }

        function movePointer(x, y) {
            if (typeof pointerX === "number" && typeof pointerY === "number") {
                let ox = x - pointerX,
                    oy = y - pointerY;

                velocity.tx =
                    velocity.tx + (ox / 8) * scale * (touchInput ? 1 : -1);
                velocity.ty =
                    velocity.ty + (oy / 8) * scale * (touchInput ? 1 : -1);
            }

            pointerX = x;
            pointerY = y;
        }

        function onMouseMove(event) {
            touchInput = false;

            movePointer(event.clientX, event.clientY);
        }

        function onTouchMove(event) {
            touchInput = true;

            movePointer(
                event.touches[0].clientX,
                event.touches[0].clientY
                // true
            );

            event.preventDefault();
        }

        function onMouseLeave() {
            pointerX = null;
            pointerY = null;
        }

        console.log("useeffect is working");
    });

    function clickOnProjects(): void {
        setProjects((showProjects = !showProjects));
        console.log("CLICKED ON PRJECTS");
    }

    return (
        <div className="pageSection" id="hero">
            <div className="infoName" data-aos="fade-left">
                <h1>Johannes Mohr</h1>
                <h3>Frontend Development</h3>
            </div>

            {/*********************** POPUP  ***********************/}
            {showProjects && (
                <Projects clickOnProjects={clickOnProjects}></Projects>
            )}

            {/* **********************PLANETS**********************/}

            <div className="planets">
                {/*  *********************PROJECTS********************/}
                <div id="projectsPlanetWrapper" className="iconWrapper">
                    <img
                        className="planetIcon"
                        onClick={clickOnProjects}
                        id="projectsPlanet"
                        src="img/planetProjects.png"
                        alt="Projects"
                    ></img>
                    <h2 className="heading" id="projectsHeading">
                        PROJECTS
                    </h2>
                </div>
                {/*  *********************RESUME********************/}
                <div id="resumePlanetWrapper" className="iconWrapper">
                    <img
                        className="planetIcon"
                        id="resumePlanet"
                        src="img/planetResume.png"
                        alt="Resume"
                    ></img>
                    <h2 className="heading" id="resumeHeading">
                        RESUME
                    </h2>
                </div>
                {/*  ********************SKILLS*********************/}
                <div id="skillsPlanetWrapper" className="iconWrapper">
                    <img
                        className="planetIcon"
                        id="skillsPlanet"
                        src="img/planetSkills.png"
                        alt="Skills Icon"
                    ></img>
                    <h2 className="heading" id="skillsHeading">
                        SKILLS
                    </h2>
                </div>
                {/*  ********************CONTACT*********************/}
                <div id="contactPlanetWrapper" className="iconWrapper">
                    <img
                        className="planetIcon"
                        id="contactPlanet"
                        src="img/planetContact.png"
                        alt="Contact"
                    ></img>
                    <h2 className="heading" id="contactHeading">
                        CONTACT
                    </h2>
                </div>
                {/*  ********************ABOUT*********************/}
                {/* <img
                    className="planetIcon"
                    id="mercury"
                    src="img/mercury.png"
                    alt="mercury"
                ></img> */}
            </div>
            {/*  ********************Github*********************/}
            <div className="socials">
                <img
                    className="planetIcon"
                    id="githubIcon"
                    src="img/github.png"
                    alt="Github Icon"
                ></img>

                <img
                    className="planetIcon"
                    id="linkedinIcon"
                    src="img/linkedin.png"
                    alt="Linkedin"
                ></img>
            </div>
            <canvas></canvas>
        </div>
    );
}