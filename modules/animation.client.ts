import type { ShallowRef } from 'vue'
import type {
  Object3DEventMap,
  Texture,
} from 'three'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  Mesh,
  AmbientLight,
  DirectionalLight,
  TextureLoader,
  MeshPhysicalMaterial,
  RingGeometry,
  DoubleSide,
  Vector2,
  Raycaster,
} from 'three'
import * as Tone from 'tone'
import random from 'canvas-sketch-util/random'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { periodicElements, type Element } from '~/data/periodic-table'

export default function useAnimation(canvasEl: Readonly<ShallowRef<HTMLCanvasElement>>) {
  if (import.meta.client) {
    const scene = new Scene()
    const camera = new PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 4000)
    const controls = new OrbitControls(camera, canvasEl.value)
    controls.update()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.05

    let cameraAngle = 0

    const texture = new TextureLoader().load('waterbumpmap.jpg')

    const light = new DirectionalLight('#f1faee', 5)
    light.position.set(2, 2, 2).normalize()
    scene.add(light)

    const ambientLight = new AmbientLight('#f1faee')
    ambientLight.position.set(-2, -2, -2).normalize()
    scene.add(ambientLight)

    camera.position.z = 40
    camera.position.x = 0
    camera.position.y = -2

    const renderer = new WebGLRenderer({ canvas: canvasEl.value, alpha: true, antialias: true })
    renderer.setSize(innerWidth, innerHeight)

    const spheres = createSpheres(scene, camera, texture)

    function animate() {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
      cameraAngle += 0.0005 // Adjust speed as needed
      camera.position.x = Math.cos(cameraAngle) * 100
      camera.position.z = Math.sin(cameraAngle) * 100
      camera.position.y = 1 // Adjust height as needed
      controls.update()
      updateSpheres(spheres)
    }

    animate()

    window.addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(innerWidth, innerHeight)
    })

    const raycaster = new Raycaster()
    const mouse = new Vector2()

    let intersecting = false
    const synth = new Tone.Synth({
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 1,
        release: 0.05,
        decay: 2,
      },
    })
    synth.volume.value = -32
    synth.toDestination()
    const pattern = new Tone.Pattern((time, note) => {
      synth.triggerAttackRelease(note, 0.25)
    }, ['C3', 'E3', 'G3', 'B3', 'C4', 'E4', 'G4', 'B4'], 'random')

    function initPattern() {
      const reverb = new Tone.JCReverb({
        roomSize: 0.97,
        wet: 0.8,
      }).toDestination()
      synth.connect(reverb)

      pattern.start()
      Tone.Transport.start()
    }

    function stopPattern() {
      pattern.stop()
    }

    function initSynth() {
      const synth = new Tone.Synth({
        oscillator: {
          type: 'sine',
        },
        envelope: {
          attack: 0,
          release: 0.05,
          decay: 2,
        },
      }).toDestination()
      const possibleNotes = ['C6', 'E6', 'G6', 'B6']
      synth.volume.value = -48
      const reverb = new Tone.JCReverb({
        roomSize: 0.95,
        wet: 0.8,
      }).toDestination()
      const limiter = new Tone.Limiter(-16)
      synth.connect(reverb)
      reverb.connect(limiter)
      synth.connect(limiter)

      window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1

        raycaster.setFromCamera(mouse, camera)

        const intersects = raycaster.intersectObjects(spheres, false)

        if (intersects.length > 0) {
          if (intersecting) {
            return
          }

          synth.triggerAttackRelease(possibleNotes[Math.floor(Math.random() * possibleNotes.length)], '4n')
          intersecting = true

          // Mouse is over an object, intersects[0].object is the closest
          console.log('Mouse over object:', intersects[0].object)
        }
        else {
          intersecting = false
        }
      })
    }

    return { initSynth, initPattern, stopPattern }
  }
}

function createSpheres(scene: Scene, camera: PerspectiveCamera, texture: Texture) {
  const array = []

  for (let i = 0; i <= 10; i++) {
    const randomPosX = random.range(-(camera.getFilmWidth()), camera.getFilmWidth())
    const randomPosY = random.range(-(camera.getFilmHeight()), camera.getFilmHeight())
    const randomPosZ = random.range(camera.position.z, camera.position.y - 100)

    const geometry = new SphereGeometry(0.9, 32, 32)
    const material = new MeshPhysicalMaterial({ color: '#e3e2df', bumpMap: texture, iridescence: 1, ior: 0.5, metalness: 0.5 })
    const sphere = new Mesh(geometry, material)

    // @ts-expect-error I swear to god TS I will harm you
    sphere.element = getRandomElementFromPeriodicTable()

    // @ts-expect-error I swear to god TS I will harm you
    const ringGeometries = createRingGeometriesFromElement(sphere.element)

    const ringMaterial = new MeshPhysicalMaterial({ color: '#e3e2df', side: DoubleSide, transparent: true, iridescence: 1, opacity: 1 })

    ringGeometries.forEach((geometry) => {
      const ringMesh = new Mesh(geometry, ringMaterial)

      ringMesh.rotation.x = Math.floor(Math.random() * 10)
      ringMesh.rotation.y = Math.floor(Math.random() * 10)

      sphere.add(ringMesh)
    })

    sphere.material.transparent = true

    sphere.position.x = randomPosX
    sphere.position.y = randomPosY
    sphere.position.z = randomPosZ
    scene.add(sphere)
    array.push(sphere)
  }

  return array
}

/**
 * @function updateSpheres
 * @param  {Array} sphere objects collection of generated spheres
 * @param  {Object} camera  https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
 */
function updateSpheres(spheres: Mesh<SphereGeometry, MeshPhysicalMaterial, Object3DEventMap>[]) {
  const sphereRotationSpeed = 0.1

  for (let i = 0; i < spheres.length; i++) {
    spheres[i].rotation.y = spheres[i].rotation.y + 0.005

    if (spheres[i].children) {
      for (let a = 0; a < spheres[i].children.length; a++) {
        if ('children' in spheres[i] && 'rotation' in spheres[i].children[a]) {
          spheres[i].children[a].rotation.x = spheres[i].children[a].rotation.x + sphereRotationSpeed
          spheres[i].children[a].rotation.y = spheres[i].children[a].rotation.y + sphereRotationSpeed
        }
      }
    }
  }
}

function getRandomElementFromPeriodicTable(): Element {
  return periodicElements[Math.floor(Math.random() * periodicElements.length)]
}

function createRingGeometriesFromElement(element: Element): RingGeometry[] {
  const ringGeometries: RingGeometry[] = []

  for (let i = 0; i < element.shells.length; i++) {
    const shellsDivisor = Math.ceil(element.shells[i] / 8)

    for (let a = 0; a < shellsDivisor; a++) {
      const geometry = new RingGeometry((i * 2 + 0.2), (i * 2 + 0.25), 80, 1, 0)
      ringGeometries.push(geometry)
    }
  }

  return ringGeometries
}
