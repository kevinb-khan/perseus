import {findIntersectionOfRays, segmentsIntersect} from "./geometry";

import type {Segment} from "./geometry";

describe("segmentsIntersect", () => {
    it("returns false when segments have zero length", () => {
        const segment1: Segment = [
            [0, 0],
            [0, 0],
        ];
        const segment2: Segment = [
            [1, 1],
            [1, 1],
        ];
        expect(segmentsIntersect(segment1, segment2)).toBe(false);
    });

    it("returns false when segments are the same", () => {
        // intersecting segments must have a SINGLE intersection point.
        const segment1: Segment = [
            [0, 0],
            [1, 1],
        ];
        const segment2: Segment = [
            [0, 0],
            [1, 1],
        ];
        expect(segmentsIntersect(segment1, segment2)).toBe(false);
    });

    it("returns false when an endpoint touches the other segment (lambda = 1)", () => {
        // We treat segments as open (exclusive of their endpoints).
        const segment1: Segment = [
            [0, 0],
            [1, 1],
        ];
        const segment2: Segment = [
            [0, 2],
            [2, 0],
        ];
        expect(segmentsIntersect(segment1, segment2)).toBe(false);
    });

    it("returns false when an endpoint touches the other segment (lambda = 0)", () => {
        // We treat segments as open (exclusive of their endpoints).
        const segment1: Segment = [
            [0, 0],
            [1, 1],
        ];
        const segment2: Segment = [
            [-1, 1],
            [1, -1],
        ];
        expect(segmentsIntersect(segment1, segment2)).toBe(false);
    });

    it("returns false when endpoints touch (gamma = 0)", () => {
        // We treat segments as open (exclusive of their endpoints).
        const segment1: Segment = [
            [0, 0],
            [1, 1],
        ];
        const segment2: Segment = [
            [2, 1],
            [1, 1],
        ];
        expect(segmentsIntersect(segment1, segment2)).toBe(false);
    });

    it("returns false when endpoints touch (gamma = 1)", () => {
        // We treat segments as open (exclusive of their endpoints).
        const segment1: Segment = [
            [0, 0],
            [1, 1],
        ];
        const segment2: Segment = [
            [1, 1],
            [2, 1],
        ];
        expect(segmentsIntersect(segment1, segment2)).toBe(false);
    });

    it("returns false given two horizontal segments", () => {
        const segment1: Segment = [
            [0, 0],
            [1, 0],
        ];
        const segment2: Segment = [
            [0, 1],
            [1, 1],
        ];
        expect(segmentsIntersect(segment1, segment2)).toBe(false);
    });

    it("returns false given two vertical segments", () => {
        const segment1: Segment = [
            [0, 0],
            [0, 1],
        ];
        const segment2: Segment = [
            [1, 0],
            [1, 1],
        ];
        expect(segmentsIntersect(segment1, segment2)).toBe(false);
    });

    it("returns false given two parallel diagonal segments", () => {
        const segment1: Segment = [
            [0, 0],
            [1, 1],
        ];
        const segment2: Segment = [
            [0, 1],
            [1, 2],
        ];
        expect(segmentsIntersect(segment1, segment2)).toBe(false);
    });

    it("returns true given intersecting segments", () => {
        const segment1: Segment = [
            [0, 0],
            [1, 1],
        ];
        const segment2: Segment = [
            [1, 0],
            [0, 1],
        ];
        expect(segmentsIntersect(segment1, segment2)).toBe(true);
    });

    it("returns false when segments are not parallel but do not intersect (lambda > 1)", () => {
        const segment1: Segment = [
            [0, 0],
            [1, 1],
        ];
        const segment2: Segment = [
            [9, 0],
            [0, 9],
        ];
        expect(segmentsIntersect(segment1, segment2)).toBe(false);
    });

    it("returns false when segments are not parallel but do not intersect (lambda < 0)", () => {
        const segment1: Segment = [
            [0, 0],
            [1, 1],
        ];
        const segment2: Segment = [
            [-9, 0],
            [0, -9],
        ];
        expect(segmentsIntersect(segment1, segment2)).toBe(false);
    });

    it("returns false when segments are not parallel but do not intersect (gamma > 1)", () => {
        const segment1: Segment = [
            [-9, 0],
            [0, -9],
        ];
        const segment2: Segment = [
            [0, 0],
            [1, 1],
        ];
        expect(segmentsIntersect(segment1, segment2)).toBe(false);
    });

    it("returns false when segments are not parallel but do not intersect (gamma < 0)", () => {
        const segment1: Segment = [
            [9, 0],
            [0, 9],
        ];
        const segment2: Segment = [
            [0, 0],
            [1, 1],
        ];
        expect(segmentsIntersect(segment1, segment2)).toBe(false);
    });
});

describe("findIntersectionOfRays", () => {
    it("returns undefined when the direction of the first ray is undefined", () => {
        const ray1: Segment = [
            [0, 0],
            [0, 0],
        ];
        const ray2: Segment = [
            [-1, -1],
            [1, 1],
        ];
        expect(findIntersectionOfRays(ray1, ray2)).toBe(undefined);
    });

    it("returns undefined when the direction of the second ray is undefined", () => {
        const ray1: Segment = [
            [-1, -1],
            [1, 1],
        ];
        const ray2: Segment = [
            [0, 0],
            [0, 0],
        ];
        expect(findIntersectionOfRays(ray1, ray2)).toBe(undefined);
    });

    it("returns undefined when the rays are parallel", () => {
        const ray1: Segment = [
            [0, 0],
            [1, 1],
        ];
        const ray2: Segment = [
            [0, 1],
            [1, 2],
        ];
        expect(findIntersectionOfRays(ray1, ray2)).toBe(undefined);
    });

    it("returns the intersection point", () => {
        const ray1: Segment = [
            [0, 0],
            [1, 1],
        ];
        const ray2: Segment = [
            [1, 0],
            [1, 0.5],
        ];
        expect(findIntersectionOfRays(ray1, ray2)).toEqual([1, 1]);
    });

    it("returns undefined when one ray points away from the other", () => {
        const ray1: Segment = [
            [0, 0],
            [1, 1],
        ];
        const ray2: Segment = [
            [1, 0],
            [1, -0.5],
        ];
        expect(findIntersectionOfRays(ray1, ray2)).toBe(undefined);
    });
});
