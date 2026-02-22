import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface LinkData {
  name: string;
  boxSize?: [number, number, number];
  color: string;
}

interface JointData {
  name: string;
  type: string;
  parent: string;
  child: string;
  originXYZ: [number, number, number];
}

interface LayoutNode {
  link: LinkData;
  joint?: JointData;
  children: LayoutNode[];
  x: number;
  y: number;
}

const JOINT_COLORS: Record<string, string> = {
  revolute: '#e74c3c',
  prismatic: '#3498db',
  continuous: '#e67e22',
  fixed: '#95a5a6',
  floating: '#8e44ad',
  planar: '#16a085',
};

const LINK_COLORS = [
  '#2980b9', '#27ae60', '#8e44ad', '#d35400', '#16a085', '#2c3e50',
];

function parseURDF(xmlString: string): { links: Map<string, LinkData>; joints: JointData[] } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  const links = new Map<string, LinkData>();
  let colorIdx = 0;

  doc.querySelectorAll('link').forEach((el) => {
    const name = el.getAttribute('name') ?? '';
    const boxEl = el.querySelector('visual geometry box');
    const colorEl = el.querySelector('visual material color');

    let color = LINK_COLORS[colorIdx % LINK_COLORS.length];
    colorIdx++;

    if (colorEl) {
      const rgba = colorEl.getAttribute('rgba') ?? '';
      const parts = rgba.split(' ').map(Number);
      if (parts.length >= 3) {
        const [r, g, b] = parts.map((v) => Math.round(v * 255));
        color = `rgb(${r},${g},${b})`;
      }
    }

    const link: LinkData = { name, color };
    if (boxEl) {
      const sizeStr = boxEl.getAttribute('size') ?? '0.05 0.05 0.05';
      const [sx, sy, sz] = sizeStr.split(' ').map(Number);
      link.boxSize = [sx, sy, sz];
    }
    links.set(name, link);
  });

  const joints: JointData[] = [];
  doc.querySelectorAll('joint').forEach((el) => {
    const name = el.getAttribute('name') ?? '';
    const type = el.getAttribute('type') ?? 'fixed';
    const parent = el.querySelector('parent')?.getAttribute('link') ?? '';
    const child = el.querySelector('child')?.getAttribute('link') ?? '';
    const originEl = el.querySelector('origin');
    let originXYZ: [number, number, number] = [0, 0, 0];
    if (originEl) {
      const xyz = (originEl.getAttribute('xyz') ?? '0 0 0').split(' ').map(Number);
      originXYZ = [xyz[0] ?? 0, xyz[1] ?? 0, xyz[2] ?? 0];
    }
    joints.push({ name, type, parent, child, originXYZ });
  });

  return { links, joints };
}

function buildTree(links: Map<string, LinkData>, joints: JointData[]): LayoutNode | null {
  const childSet = new Set(joints.map((j) => j.child));
  const rootName = [...links.keys()].find((n) => !childSet.has(n));
  if (!rootName) return null;

  const childrenMap = new Map<string, JointData[]>();
  joints.forEach((j) => {
    if (!childrenMap.has(j.parent)) childrenMap.set(j.parent, []);
    childrenMap.get(j.parent)!.push(j);
  });

  function build(linkName: string, parentJoint?: JointData): LayoutNode {
    const link = links.get(linkName) ?? { name: linkName, color: '#999' };
    const childJoints = childrenMap.get(linkName) ?? [];
    return {
      link,
      joint: parentJoint,
      children: childJoints.map((j) => build(j.child, j)),
      x: 0,
      y: 0,
    };
  }

  return build(rootName);
}

const H_GAP = 170;
const V_GAP = 130;

function assignPositions(node: LayoutNode, depth: number, offset: number): number {
  if (node.children.length === 0) {
    node.x = offset + H_GAP / 2;
    node.y = depth * V_GAP + 60;
    return offset + H_GAP;
  }
  let cur = offset;
  for (const child of node.children) {
    cur = assignPositions(child, depth + 1, cur);
  }
  const first = node.children[0].x;
  const last = node.children[node.children.length - 1].x;
  node.x = (first + last) / 2;
  node.y = depth * V_GAP + 60;
  return cur;
}

function collectAll(node: LayoutNode, acc: LayoutNode[] = []): LayoutNode[] {
  acc.push(node);
  node.children.forEach((c) => collectAll(c, acc));
  return acc;
}

const BOX_W = 130;
const BOX_H = 44;
const JOINT_R = 11;

function URDFDiagram({ root }: { root: LayoutNode }) {
  const all = collectAll(root);
  const maxX = Math.max(...all.map((n) => n.x));
  const maxY = Math.max(...all.map((n) => n.y));
  const svgW = Math.max(maxX + BOX_W / 2 + 20, 500);
  const svgH = maxY + BOX_H / 2 + 40;

  return (
    <svg
      width={svgW}
      height={svgH}
      style={{ border: '1px solid #ccc', background: '#f8f9fa', borderRadius: 8 }}
    >
      {/* Edges */}
      {all.map((node) =>
        node.children.map((child) => (
          <line
            key={`edge-${node.link.name}-${child.link.name}`}
            x1={node.x}
            y1={node.y}
            x2={child.x}
            y2={child.y}
            stroke="#aaa"
            strokeWidth={2}
          />
        ))
      )}

      {/* Joint circles (rendered between parent and child) */}
      {all
        .filter((n) => n.joint)
        .map((node) => {
          const parentNode = all.find((p) => p.children.includes(node));
          if (!parentNode) return null;
          const jx = (parentNode.x + node.x) / 2;
          const jy = (parentNode.y + node.y) / 2;
          const jColor = JOINT_COLORS[node.joint!.type] ?? '#666';
          return (
            <g key={`joint-${node.joint!.name}`}>
              <circle cx={jx} cy={jy} r={JOINT_R} fill={jColor} stroke="#333" strokeWidth={1} />
              <text
                x={jx + JOINT_R + 4}
                y={jy + 4}
                fontSize={10}
                fill={jColor}
                fontFamily="monospace"
              >
                {node.joint!.name} ({node.joint!.type})
              </text>
            </g>
          );
        })}

      {/* Link rectangles */}
      {all.map((node) => (
        <g key={`link-${node.link.name}`}>
          <rect
            x={node.x - BOX_W / 2}
            y={node.y - BOX_H / 2}
            width={BOX_W}
            height={BOX_H}
            fill={node.link.color}
            stroke="#222"
            strokeWidth={1.5}
            rx={6}
          />
          <text
            x={node.x}
            y={node.y - 5}
            textAnchor="middle"
            fontSize={11}
            fill="#fff"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            {node.link.name}
          </text>
          {node.link.boxSize && (
            <text
              x={node.x}
              y={node.y + 10}
              textAnchor="middle"
              fontSize={9}
              fill="rgba(255,255,255,0.8)"
              fontFamily="monospace"
            >
              {node.link.boxSize.map((v) => v.toFixed(3)).join(' × ')} m
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

function Legend() {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
      {Object.entries(JOINT_COLORS).map(([type, color]) => (
        <span key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <svg width={18} height={18}>
            <circle cx={9} cy={9} r={8} fill={color} />
          </svg>
          {type}
        </span>
      ))}
    </div>
  );
}

export default function URDFViewer() {
  const [root, setRoot] = useState<LayoutNode | null>(null);
  const [urdfText, setUrdfText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/pepper_gripper.urdf')
      .then((r) => r.text())
      .then((text) => {
        setUrdfText(text);
        const { links, joints } = parseURDF(text);
        const tree = buildTree(links, joints);
        if (tree) {
          assignPositions(tree, 0, 0);
          setRoot(tree);
        } else {
          setError('루트 링크를 찾을 수 없습니다.');
        }
      })
      .catch(() => setError('URDF 파일을 불러오는 중 오류가 발생했습니다.'));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Pepper Gripper URDF 시각화</h1>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/booklist">
          <button>목록으로</button>
        </Link>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {root ? (
        <>
          <div style={{ overflowX: 'auto' }}>
            <URDFDiagram root={root} />
          </div>
          <Legend />
        </>
      ) : (
        !error && <p>불러오는 중...</p>
      )}

      {urdfText && (
        <details style={{ marginTop: '2rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>URDF 소스 보기</summary>
          <pre
            style={{
              background: '#f4f4f4',
              padding: '1rem',
              fontSize: 12,
              overflow: 'auto',
              maxHeight: 400,
              marginTop: '0.5rem',
              borderRadius: 4,
            }}
          >
            {urdfText}
          </pre>
        </details>
      )}
    </div>
  );
}
